---
title: Symfony 整合
description: SoFinder 的 Symfony Bundle、资源、ACL、UI、图片与 CKEditor 配置。
---


在应用程序 Kernel 注册 Bundle：

```php
yield new \SohoPHP\SoFinder\SoFinderBundle();
```

以应用程序专用 prefix 导入明确路由：

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

配置存储资源。每个 root 都是安全边界；SoFinder 不允许向父层穿越或使用 symbolic link：

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    radius: '10px'
  trash_dir: '%kernel.project_dir%/var/sofinder/trash'
  usage_dir: '%kernel.project_dir%/var/sofinder/usage'
  trash_retention_days: 30
  trash_max_items: 1000
  trash_max_bytes: 1073741824
  ui:
    mode: auto          # auto、manager 或 picker
    header: true        # 在 Logo 旁显示品牌文字
    logo: true          # 命令栏内的紧凑 Logo，默认启用
    search: true
    language_switcher: true
    view_switcher: true
    folder_tree: false # 初始偏好；每个浏览器可在配置中自行开启。
    scale: standard    # compact、standard、large、xlarge；浏览器偏好优先。
    upload_conflict_strategy: ask # ask、rename、overwrite、skip；浏览器偏好优先。
  maintenance:
    mode: inline       # inline、messenger、external、disabled
    min_interval_seconds: 300
    max_items_per_run: 50
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
  resources:
    Images:
      adapter: local
      root: '%kernel.project_dir%/uploads/editor/images'
      public_url: '/uploads/editor/images'
      delivery_mode: public
      max_size: 20971520
      quota: 1073741824
      max_file_name_length: 120
      max_folder_name_length: 50
      max_folder_depth: 5
      max_image_pixels: 50000000
      max_batch_items: 100
      max_recursive_items: 10000
      max_archive_items: 1000
      max_archive_bytes: 536870912
      allowed_extensions: [avif, bmp, gif, ico, jpeg, jpg, png, webp]
      allowed_mime_types: [image/avif, image/bmp, image/gif, image/jpeg, image/png, image/vnd.microsoft.icon, image/x-bmp, image/x-icon, image/webp]
      roles: [ROLE_EDITOR]
      operation_roles:
        delete: [ROLE_FILE_ADMIN]
      path_acl:
        - { path: private, operations: ['*'], roles: [ROLE_FILE_ADMIN] }
        - { path: shared, operations: [read, list], roles: [ROLE_EDITOR] }
        - { path: shared/locked, operations: [delete], roles: [], allow: false }
```

默认 Symfony Authorization adapter 要求 `IS_AUTHENTICATED_FULLY`。需要资源层或操作层 ACL 的应用程序，可替换 `AuthorizationInterface` service alias。空的 `roles` 列表维持「已登录用户」行为；`operation_roles` 可针对 `upload`、`rename`、`copy`、`move`、`delete`、`read`、`list` 等操作覆盖资源 roles。

Path rule 会继承到子目录，最明确的匹配路径优先，适用的 deny 优先于 allow。浏览器获取的 capabilities 只供 UI 参考；服务器会再次授权最终路径。Quota 设置为零表示不限制。

`delivery_mode: public` 可保留直接 URL，但直接请求不经 SoFinder，因此不能套用读取 ACL。敏感资源必须使用 `proxy`、移除 Web Server 对 storage root 的 alias，并留空 `public_url`。Proxy 支持 Range、ETag 与条件式请求，只有安全 raster image MIME 可使用 inline 显示。

### 宿主应用程序入口路由

资源可发布宿主路由，而非存储空间或 SoFinder proxy URL。当应用程序需要提供稳定 URL、记录下载、查询数据库、流式传输私有对象或重新导向 CDN 时，这个功能很有用：

```yaml
so_finder:
  resources:
    Documents:
      adapter: s3
      root: component-files
      delivery_mode: proxy
      public_url: ''
      entry_url:
        route: file.download
        absolute: true
        parameters:
          resource: '{resource}'
          path: '{path}'
          name: '{name}'
```

SoFinder 显示文件入口 URL 时，配置的路由优先。内建样板值包括 `{resource}`、`{path}`、`{name}`、`{stem}`、`{extension}` 与 `{storage_url}`。不是路由 path variable 的额外参数，会由 Symfony 产生为 query parameter。

无法从 object key 推断 `{id}` 之类的数据库值。宿主应用程序可以实现 `EntryUrlContextProviderInterface`；Symfony autoconfiguration 会自动加上 tag：

```php
use SohoPHP\SoFinder\Contract\EntryUrlContextProviderInterface;
use SohoPHP\SoFinder\Value\Entry;
use SohoPHP\SoFinder\Value\ResourceType;

final readonly class FileEntryUrlContext implements EntryUrlContextProviderInterface
{
    public function __construct(private FileRepository $files) {}

    public function context(ResourceType $resource, Entry $entry): array
    {
        if ($resource->name !== 'Documents') {
            return [];
        }

        $record = $this->files->findByStorageKey($entry->path);

        return $record === null ? [] : ['id' => $record->id()];
    }
}
```

资源接着可将 `id: '{id}'` 与 `name: '{name}'` 对应至 `/file/download/{id}-{name}` 之类的路由。路由 controller 仍须负责自己的存取政策，并可通过 `FileManager::read()` 流式传输，或使用应用程序的存储服务重新导向公开供应商 URL。

主题色只接受三位或六位 hexadecimal；圆角只接受 `0px` 至 `32px`，避免配置值变成任意 CSS。公开 Plugin 契约请见[外挂系统](/zh-CN/plugins)。

浏览器齿轮菜单会将图片工具显示偏好存在该浏览器的 local storage，不会授予 capability 或改变服务器 ACL。Resize、crop、rotation 与默认尺寸默认隐藏，可在配置中开启。复制／移动目的地只会显示资源 API 返回的文件夹；服务器仍会规范化并重新授权最终路径。

`mode: auto` 会在 CKEditor 与 `select=1` 请求使用 `picker`，其他入口使用
`manager`。浏览器 URL 只能以 `uiMode=auto|manager|picker`、`uiTools=common|full`，以及值为 `0`
或 `1` 的 `uiHeader`、`uiLogo`、`uiSearch`、`uiLanguage`、`uiView` 覆盖外观；
无效值回退到宿主配置，且这些参数不会授予操作权限或略过服务器授权。

名称限制以 Unicode 字符数计算，而非 byte。资源 root 是第零层，因此 `max_folder_depth: 5` 允许文件位于第五层文件夹，但不允许再新建第六层。复制、移动或重新命名文件夹时会检查完整子树。名称支持范围为 1–255 字符，文件夹深度为 1–100 层。

所有变更 API 都要求 `X-CSRF-TOKEN` header。Browser route 会把 token 注入 React 应用程序。CKEditor 4 兼容上传必须通过 `_token` 传入同一 token；Origin 与 Referer 只是附加检查，不能取代 CSRF 验证。

## CKEditor 4

浏览选择、快速上传、内容传递和故障排查请参考完整的 [CKEditor 4 指南](/zh-CN/ckeditor4)。

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&_token=" + encodeURIComponent(soFinderCsrfToken)
});
```

使用外部调度时，每日安排 `sofinder:trash:cleanup`，部署时执行 `sofinder:security:audit`。第一次部署后及每日执行 `sofinder:usage:recalculate`，以校准 SoFinder 以外的文件变更。一般请求使用具锁的持久化计数器，不会递归扫描资源；任何 critical audit 结果都应阻挡发布。
