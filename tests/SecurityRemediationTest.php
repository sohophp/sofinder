<?php
declare(strict_types=1);
namespace SohoPHP\SoFinder\Tests;
use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Contract\{AuthorizationInterface,ActorProviderInterface,CsrfTokenProviderInterface,WorkspaceResolverInterface,RoleAuthorizationInterface};
use SohoPHP\SoFinder\Value\{ResourceType,ResourceStorage,RequestContext,WorkspaceContext};
use SohoPHP\SoFinder\{ResourceRegistry,FileManager};
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Security\{SignedUrlManager,PathGuard,LocalRequestGateStore,RequestBudget};
use SohoPHP\SoFinder\Asset\{JsonAssetCatalog,JsonAssetAccessSessionStore,AssetAccessSessionManager};
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use SohoPHP\SoFinder\Framework\CallbackRequestContextProvider;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Psr15\{HostServices,LocalApplicationFactory};
use SohoPHP\SoFinder\Http\{RequestInput,EndpointCatalog};
use Nyholm\Psr7\{ServerRequest,Stream};
use Nyholm\Psr7\Factory\Psr17Factory;
use Symfony\Component\EventDispatcher\EventDispatcher;

final class SecurityRemediationTest extends TestCase
{
    private string $root;
    protected function setUp(): void { $this->root=sys_get_temp_dir().'/sofinder-remediation-'.bin2hex(random_bytes(8));mkdir($this->root.'/files',0700,true);file_put_contents($this->root.'/files/private.txt','original-secret'); }
    protected function tearDown(): void {
        $it=new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->root,\FilesystemIterator::SKIP_DOTS),\RecursiveIteratorIterator::CHILD_FIRST);
        foreach($it as $item) $item->isDir()?rmdir($item->getPathname()):unlink($item->getPathname());rmdir($this->root);
    }
    private function auth(): AuthorizationInterface { return new class implements AuthorizationInterface { public function isAuthenticated():bool{return true;}public function isGranted(string $o,ResourceType $r,string $p):bool{return true;} }; }
    private function actor(): ActorProviderInterface { return new class implements ActorProviderInterface { public function actorId():string{return 'actor-a';} }; }
    private function csrf(): CsrfTokenProviderInterface { return new class implements CsrfTokenProviderInterface { public function token(RequestContext $c):string{return 'test-csrf';}public function isValid(RequestContext $c,string $t):bool{return $t==='test-csrf';} }; }
    private function denied(callable $operation,string $code): void {
        try{$operation();self::fail('Unsafe operation was accepted');}catch(SoFinderException $e){self::assertSame($code,$e->errorCode);}
    }
    public function testSessionOwnerAdminLegacyAndWorkspaceBoundaries(): void {
        $resolver=new class implements WorkspaceResolverInterface { public string $actor='actor-a';public string $workspace='main';public array $resources=['Private'];public function resolve(RequestContext $r):WorkspaceContext{return new WorkspaceContext($this->workspace,$this->actor,$this->resources);} };
        $roles=new class implements RoleAuthorizationInterface {public bool $admin=false;public function isGranted(string $role):bool{return $this->admin&&$role==='ROLE_ADMIN';}};
        $workspaces=new WorkspaceProvider($resolver,new CallbackRequestContextProvider(fn()=>new RequestContext()));
        $resource=new ResourceType('Private',$this->root.'/files','',['txt'],deliveryMode:'proxy');
        $registry=new ResourceRegistry([new ResourceStorage($resource,new LocalStorageAdapter($this->root.'/files'))]);
        $files=new FileManager($registry,$this->auth(),new EventDispatcher(),workspaces:$workspaces);
        $catalog=new JsonAssetCatalog($this->root.'/catalog.json');$record=$catalog->register('main','Private',$files->entry('Private','private.txt'));
        $store=new JsonAssetAccessSessionStore($this->root.'/sessions');
        $manager=new AssetAccessSessionManager($catalog,$store,$workspaces,$files,$registry,true,roles:$roles);
        $session=$manager->create([$record->id]);$resolver->actor='actor-b';$resolver->resources=['Other'];
        $this->denied(fn()=>$manager->revoke($session['id']),'access_denied');self::assertNotNull($store->get($session['id']));
        $roles->admin=true;$this->denied(fn()=>$manager->revoke($session['id']),'access_denied');
        $resolver->resources=['Private'];$resolver->workspace='other';$this->denied(fn()=>$manager->revoke($session['id']),'asset_access_session_invalid');
        $resolver->workspace='main';$manager->revoke($session['id']);self::assertNull($store->get($session['id']));
        $roles->admin=false;$resolver->actor='actor-a';$session=$manager->create([$record->id]);
        $data=$store->get($session['id']);unset($data['owner']);$store->put($session['id'],$data);
        $this->denied(fn()=>$manager->revoke($session['id']),'access_denied');
        $this->denied(fn()=>$manager->open($session['token'],$record->id),'asset_access_session_invalid');
        $roles->admin=true;$manager->revoke($session['id']);self::assertNull($store->get($session['id']));
        $roles->admin=false;$session=$manager->create([$record->id]);$manager->revoke($session['id']);self::assertNull($store->get($session['id']));
    }
    public function testSameSizeTimestampReplacementInvalidatesBothGrantTypes(): void {
        $resolver=new class implements WorkspaceResolverInterface {public function resolve(RequestContext $r):WorkspaceContext{return new WorkspaceContext('main','actor-a',['Private']);}};
        $workspace=new WorkspaceProvider($resolver,new CallbackRequestContextProvider(fn()=>new RequestContext()));
        $resource=new ResourceType('Private',$this->root.'/files','',['txt'],deliveryMode:'proxy');$registry=new ResourceRegistry([new ResourceStorage($resource,new LocalStorageAdapter($this->root.'/files'))]);
        $files=new FileManager($registry,$this->auth(),new EventDispatcher(),workspaces:$workspace);
        $signed=new SignedUrlManager($files,$registry,new PathGuard(),true,str_repeat('test',8));$issued=$signed->issue('Private','private.txt');
        $catalog=new JsonAssetCatalog($this->root.'/catalog.json');$asset=$catalog->register('main','Private',$files->entry('Private','private.txt'));
        $sessions=new AssetAccessSessionManager($catalog,new JsonAssetAccessSessionStore($this->root.'/sessions'),$workspace,$files,$registry,true);$session=$sessions->create([$asset->id]);
        $before=$signed->open($issued['token']);self::assertSame('original-secret',stream_get_contents($before['stream']));fclose($before['stream']);
        $mtime=filemtime($this->root.'/files/private.txt');file_put_contents($this->root.'/files/private.txt','replaced-secret');touch($this->root.'/files/private.txt',$mtime);clearstatcache();
        $this->denied(fn()=>$signed->open($issued['token']),'signed_url_stale');
        $this->denied(fn()=>$sessions->open($session['token'],$asset->id),'asset_access_session_stale');
        $fresh=$signed->issue('Private','private.txt');$opened=$signed->open($fresh['token']);self::assertSame('replaced-secret',stream_get_contents($opened['stream']));fclose($opened['stream']);
    }
    public function testDamagedStateAndLockTimeoutFailWithoutReset(): void {
        $store=new LocalRequestGateStore($this->root.'/gate',0.02);$store->mutate('normal','actor-a',fn($s)=>['count'=>50]);
        $file=$this->root.'/gate/normal-'.hash('sha256','actor-a').'.json';file_put_contents($file,'{broken');
        $this->denied(fn()=>$store->mutate('normal','actor-a',fn($s)=>['count'=>1]),'rate_limiter_unavailable');self::assertSame('{broken',file_get_contents($file));
        file_put_contents($file,'{"count":50}');$lock=fopen($file.'.lock','c+b');flock($lock,LOCK_EX);
        try{$this->denied(fn()=>$store->mutate('normal','actor-a',fn($s)=>['count'=>1]),'rate_limiter_unavailable');self::assertSame('{"count":50}',file_get_contents($file));}finally{flock($lock,LOCK_UN);fclose($lock);}
    }
    public function testPsrBudgetRejectsSecondRequestAndRetainsStableContract(): void {
        $factory=new Psr17Factory();$app=(new LocalApplicationFactory($factory,$factory,new HostServices($this->auth(),$this->actor(),$this->csrf(),new EventDispatcher()),['limits'=>['normal'=>['max_requests'=>1,'interval'=>60,'max_concurrent'=>1]]],$this->root.'/state',$this->root.'/files'))->create();
        $fallback=new class($factory) implements \Psr\Http\Server\RequestHandlerInterface {public function __construct(private Psr17Factory $f){}public function handle(\Psr\Http\Message\ServerRequestInterface $r):\Psr\Http\Message\ResponseInterface{return $this->f->createResponse(404);}};
        $request=new ServerRequest('GET','/sofinder/api/entries');$middleware=$app->middleware();self::assertSame(200,$middleware->process($request,$fallback)->getStatusCode());$response=$middleware->process($request,$fallback);self::assertSame(429,$response->getStatusCode());self::assertSame('rate_limit_exceeded',json_decode((string)$response->getBody(),true)['error']['code']);
    }
    public function testEveryProcessingEndpointHasBudgetAndLeasesRelease(): void {
        foreach(EndpointCatalog::all() as $endpoint){if(in_array($endpoint->name,['sofinder_asset','sofinder_browser','sofinder_liveness'],true))continue;self::assertNotNull(RequestBudget::group($endpoint->name),$endpoint->name);}
        $budget=new RequestBudget(new LocalRequestGateStore($this->root.'/gate'),$this->actor(),['normal'=>['max_requests'=>0,'interval'=>60,'max_concurrent'=>1]]);
        $lease=$budget->acquire('sofinder_document_preview');$this->denied(fn()=>$budget->acquire('sofinder_document_preview_job_create'),'concurrency_limit_exceeded');$budget->release($lease);$next=$budget->acquire('sofinder_document_preview_job_create');self::assertNotNull($next);$budget->release($next);
    }
    #[\PHPUnit\Framework\Attributes\RunInSeparateProcess]
    #[\PHPUnit\Framework\Attributes\PreserveGlobalState(false)]
    public function testNativeHttpsSessionUsesSecureCookie(): void
    {
        $provider = new \SohoPHP\SoFinder\Psr15\NativeSessionCsrfTokenProvider();
        $provider->token(new RequestContext(schemeAndHost: 'https://example.test'));
        $params = session_get_cookie_params();
        self::assertTrue($params['secure']); self::assertTrue($params['httponly']);
        self::assertSame('Lax', $params['samesite']); session_destroy();
    }

    public function testAnonymousBudgetUsesTransportPeerAndIgnoresForwardedHeader(): void
    {
        $auth=new class implements AuthorizationInterface {public function isAuthenticated():bool{return false;}public function isGranted(string $o,ResourceType $r,string $p):bool{return false;}};
        $factory=new Psr17Factory();
        $handler=new class($factory) implements \SohoPHP\SoFinder\Http\EndpointHandlerInterface {
            public function __construct(private Psr17Factory $f){}
            public function endpoint():string{return 'sofinder_api_capabilities';}
            public function handle(\Psr\Http\Message\ServerRequestInterface $r):\Psr\Http\Message\ResponseInterface{return $this->f->createResponse(200);}
        };
        $budget=new RequestBudget(new LocalRequestGateStore($this->root.'/gate'),$this->actor(),['normal'=>['max_requests'=>1,'interval'=>60,'max_concurrent'=>1]],$auth);
        $dispatcher=new \SohoPHP\SoFinder\Http\EndpointDispatcher($factory,$factory,[$handler],budget:$budget);
        $request=new ServerRequest('GET','/api/capabilities',['X-Forwarded-For'=>'198.51.100.1'],null,'1.1',['REMOTE_ADDR'=>'192.0.2.1']);
        self::assertSame(200,$dispatcher->dispatch('sofinder_api_capabilities',$request)->getStatusCode());
        self::assertSame(429,$dispatcher->dispatch('sofinder_api_capabilities',$request->withHeader('X-Forwarded-For','198.51.100.2'))->getStatusCode());
        $other=new ServerRequest('GET','/api/capabilities',[],null,'1.1',['REMOTE_ADDR'=>'192.0.2.2']);
        self::assertSame(200,$dispatcher->dispatch('sofinder_api_capabilities',$other)->getStatusCode());
    }
    public function testJsonMetadataBudgetsAndObjectRequirement(): void {
        self::assertSame(['name'=>'folder'],RequestInput::json('{"name":"folder"}'));
        $this->denied(fn()=>RequestInput::json(json_encode(['ignored'=>str_repeat('x',2*1024*1024)])),'request_too_large');
        $this->denied(fn()=>RequestInput::validate(array_fill(0,5000,'x')),'request_too_large');
        $this->denied(fn()=>RequestInput::json('[1,2]'),'invalid_json');
        $nested=[];for($i=0;$i<40;$i++)$nested=['child'=>$nested];$this->denied(fn()=>RequestInput::validate($nested),'request_too_large');
    }
}
