#!/usr/bin/env bash

set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
php_bin="$repository_root/scripts/php-bin.sh"
mkdir -p "$repository_root/var"
test_dir=$(mktemp -d "$repository_root/var/cross-host-http.XXXXXX")
server_pid=''
folder="host-contract-$RANDOM-$RANDOM"
folder_created=false
base_url=''
csrf_token=''
auth=()
cookie=()

cleanup_folder()
{
    if [[ "$folder_created" != true || -z "$base_url" || -z "$csrf_token" ]]; then return; fi
    local delete_response="$test_dir/cleanup-delete.json"
    local trash_id
    curl --silent --show-error --fail "${auth[@]}" "${cookie[@]}" \
        --header "X-CSRF-TOKEN: $csrf_token" \
        --header 'Content-Type: application/json' \
        --request DELETE \
        --data "{\"resource\":\"Files\",\"path\":\"$folder\"}" \
        "$base_url/sofinder/api/entries" > "$delete_response" || return
    trash_id=$("$php_bin" -r '$p=json_decode(file_get_contents($argv[1]),true,32,JSON_THROW_ON_ERROR); echo $p["data"]["trash"]["item"]["id"]??"";' "$delete_response")
    if [[ "$trash_id" =~ ^[a-f0-9]{32}$ ]]; then
        curl --silent --show-error --fail "${auth[@]}" "${cookie[@]}" \
            --header "X-CSRF-TOKEN: $csrf_token" \
            --header 'Content-Type: application/json' \
            --request DELETE \
            --data '{"resource":"Files"}' \
            "$base_url/sofinder/api/trash/$trash_id" > /dev/null || true
    fi
    folder_created=false
}

cleanup()
{
    cleanup_folder || true
    if [[ -n "$server_pid" ]]; then
        kill "$server_pid" 2>/dev/null || true
        wait "$server_pid" 2>/dev/null || true
    fi
    rm -rf -- "$test_dir"
}
trap cleanup EXIT
cp "$repository_root/examples/laravel/.env.example" "$repository_root/examples/laravel/.env"
(cd "$repository_root/examples/laravel" && "$php_bin" artisan config:clear --quiet)

fail()
{
    printf '%s\n' "$1" >&2
    exit 1
}

canonical_json()
{
    "$php_bin" -r '
        $payload=json_decode(file_get_contents($argv[1]),true,64,JSON_THROW_ON_ERROR);
        $strip=function (&$value) use (&$strip):void {
            if (!is_array($value)) return;
            unset($value["modifiedAt"],$value["deletedAt"],$value["expiresAt"],$value["id"]);
            foreach ($value as &$item) $strip($item);
        };
        $strip($payload);
        echo json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES),"\n";
    ' "$1"
}

response_signature()
{
    local status=$1
    local headers=$2
    local body=$3
    "$php_bin" -r '
        [$status,$headersFile,$bodyFile]=array_slice($argv,1);
        $headers=file($headersFile,FILE_IGNORE_NEW_LINES)?:[];
        $values=[];
        foreach($headers as $line){
            if(!str_contains($line,":")) continue;
            [$name,$value]=explode(":",$line,2);
            $values[strtolower(trim($name))]=trim($value);
        }
        $type=strtolower(trim(explode(";",$values["content-type"]??"")[0]));
        $success="";$code="";$bodyContract="";
        if($type==="application/json"){
            $payload=json_decode(file_get_contents($bodyFile),true);
            if(!is_array($payload)) { fwrite(STDERR,"Invalid JSON contract response.\n"); exit(1); }
            $success=array_key_exists("success",$payload)?($payload["success"]?"true":"false"):"missing";
            $code=(string)($payload["error"]["code"]??"");
            if($success==="false" && isset($payload["error"])){
                $bodyContract=hash("sha256",json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES));
            } else {
                $envelope=array_keys($payload); sort($envelope);
                $data=is_array($payload["data"]??null)?array_keys($payload["data"]):[]; sort($data);
                $bodyContract=hash("sha256",json_encode([
                    "envelope"=>$envelope,
                    "data"=>$data,
                ],JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES));
            }
        }
        $required=[
            "x-content-type-options"=>"nosniff",
            "x-frame-options"=>"SAMEORIGIN",
            "x-sofinder-api-version"=>"1.0",
            "cross-origin-resource-policy"=>"same-origin",
        ];
        foreach($required as $name=>$expected){
            if(($values[$name]??null)!==$expected){
                fwrite(STDERR,"Missing or invalid $name response header.\n"); exit(1);
            }
        }
        if(!str_contains($values["content-security-policy"]??"","default-src")){
            fwrite(STDERR,"Missing restrictive Content-Security-Policy response header.\n"); exit(1);
        }
        echo implode("|",[
            $status,$type,$success,$code,$bodyContract,
            $values["x-content-type-options"]??"",
            $values["x-frame-options"]??"",
            $values["x-sofinder-api-version"]??"",
            $values["cross-origin-resource-policy"]??"",
            $values["content-security-policy"]??"",
        ]),"\n";
    ' "$status" "$headers" "$body"
}

verify_endpoint_inventory()
{
    local host=$1
    local inventory="$test_dir/endpoint-contract-cases.tsv"
    local signatures="$test_dir/$host-endpoints.signatures"
    : > "$signatures"
    while IFS=$'\t' read -r endpoint method path; do
        local key=${endpoint#sofinder_}
        local headers="$test_dir/$host-$key.headers"
        local body="$test_dir/$host-$key.body"
        local status
        local signature
        local request=(--silent --show-error "${auth[@]}" "${cookie[@]}" --request "$method" --dump-header "$headers" --output "$body" --write-out '%{http_code}')
        if [[ "$method" != GET ]]; then
            request+=(--header 'Content-Type: application/json' --data '{}')
        fi
        status=$(curl "${request[@]}" "$base_url/sofinder$path")
        signature=$(response_signature "$status" "$headers" "$body") \
            || fail "$host returned an invalid contract response for $endpoint."
        printf '%s\t%s\n' "$endpoint" "$signature" >> "$signatures"
    done < "$inventory"
    [[ "$(wc -l < "$signatures")" == 51 ]] || fail "$host did not exercise all 51 non-presentation endpoints."

    if [[ "$host" == symfony ]]; then
        cp "$signatures" "$test_dir/reference-endpoints.signatures"
    else
        if ! diff -u "$test_dir/reference-endpoints.signatures" "$signatures" >&2; then
            fail "$host endpoint inventory differs from the Symfony contract."
        fi
    fi
}

start_host()
{
    local host=$1
    local port=$2
    case "$host" in
        symfony)
            (cd "$repository_root/examples/symfony" && APP_ENV=prod APP_DEBUG=0 "$php_bin" -S "127.0.0.1:$port" -t public public/index.php) > "$test_dir/$host.log" 2>&1 &
            ;;
        laravel)
            (cd "$repository_root/examples/laravel" && SOFINDER_EXAMPLE_OFFICE=1 APP_ENV=production APP_DEBUG=0 "$php_bin" -S "127.0.0.1:$port" -t public public/index.php) > "$test_dir/$host.log" 2>&1 &
            ;;
        slim|mezzio|plain)
            (cd "$repository_root/examples/psr15" && SOFINDER_EXAMPLE_AUTHORIZED=1 SOFINDER_EXAMPLE_OFFICE=1 "$php_bin" -S "127.0.0.1:$port" "public/$host.php") > "$test_dir/$host.log" 2>&1 &
            ;;
    esac
    server_pid=$!
}

stop_host()
{
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
    server_pid=''
}

reference=''
"$php_bin" "$repository_root/scripts/export-cross-host-contract-cases.php" > "$test_dir/endpoint-contract-cases.tsv"
[[ "$(wc -l < "$test_dir/endpoint-contract-cases.tsv")" == 51 ]] || fail 'Endpoint contract inventory must contain all 51 non-presentation endpoints.'
for specification in 'symfony 18100' 'laravel 18101' 'slim 18102' 'mezzio 18103' 'plain 18104'; do
    read -r host port <<< "$specification"
    base_url="http://127.0.0.1:$port"
    start_host "$host" "$port"

    ready=false
    for _attempt in {1..50}; do
        if curl --silent --fail "$base_url/sofinder/live" > "$test_dir/$host-live.json"; then
            ready=true
            break
        fi
        if ! kill -0 "$server_pid" 2>/dev/null; then
            cat "$test_dir/$host.log" >&2
            fail "$host exited before becoming ready."
        fi
        sleep 0.2
    done
    [[ "$ready" == true ]] || fail "$host did not become ready."

    auth=()
    csrf_token='sofinder-host-contract-token'
    if [[ "$host" == symfony ]]; then
        auth=(--user demo:demo)
        curl --silent --show-error --fail "${auth[@]}" --cookie-jar "$test_dir/$host.cookies" "$base_url/sofinder/browser" > "$test_dir/$host-browser.html"
        csrf_token=$(sed -n 's/.*csrfToken&quot;:&quot;\([^&]*\)&quot;.*/\1/p' "$test_dir/$host-browser.html")
    elif [[ "$host" == laravel ]]; then
        curl --silent --show-error --fail --cookie-jar "$test_dir/$host.cookies" "$base_url/sofinder/browser" > "$test_dir/$host-browser.html"
        csrf_token=$(sed -n 's/.*csrfToken&quot;:&quot;\([^&]*\)&quot;.*/\1/p' "$test_dir/$host-browser.html")
    fi
    [[ -n "$csrf_token" ]] || fail "$host did not provide a CSRF token."

    cookie=()
    if [[ -s "$test_dir/$host.cookies" ]]; then cookie=(--cookie "$test_dir/$host.cookies"); fi

    verify_endpoint_inventory "$host"

    status=$(curl --silent --show-error "${auth[@]}" "${cookie[@]}" \
        --dump-header "$test_dir/$host-csrf.headers" \
        --header 'Content-Type: application/json' \
        --data "{\"resource\":\"Files\",\"path\":\"\",\"name\":\"$folder\"}" \
        --output "$test_dir/$host-csrf.json" \
        --write-out '%{http_code}' \
        "$base_url/sofinder/api/folders")
    [[ "$status" == 403 ]] || fail "$host returned $status instead of 403 for a missing CSRF token."
    grep -Fq '"code":"access_denied"' "$test_dir/$host-csrf.json" || fail "$host CSRF response has a different error code."

    status=$(curl --silent --show-error "${auth[@]}" "${cookie[@]}" \
        --dump-header "$test_dir/$host-create.headers" \
        --header "X-CSRF-TOKEN: $csrf_token" \
        --header 'Content-Type: application/json' \
        --data "{\"resource\":\"Files\",\"path\":\"\",\"name\":\"$folder\"}" \
        --output "$test_dir/$host-create.json" \
        --write-out '%{http_code}' \
        "$base_url/sofinder/api/folders")
    [[ "$status" == 201 ]] || fail "$host returned $status instead of 201 for folder creation."
    folder_created=true
    grep -Eiq '^Cache-Control:.*no-store' "$test_dir/$host-create.headers" || fail "$host Cache-Control does not contain no-store."
    grep -Eiq '^Cache-Control:.*private' "$test_dir/$host-create.headers" || fail "$host Cache-Control is not private."
    for header in 'X-Content-Type-Options: nosniff' 'X-SoFinder-API-Version: 1.0' 'Cross-Origin-Resource-Policy: same-origin'; do
        grep -Fiq "$header" "$test_dir/$host-create.headers" || fail "$host is missing security header $header."
    done
    canonical_json "$test_dir/$host-create.json" > "$test_dir/$host-create.canonical.json"
    if [[ -z "$reference" ]]; then
        reference="$test_dir/$host-create.canonical.json"
    else
        cmp "$reference" "$test_dir/$host-create.canonical.json" || fail "$host folder response differs from the Symfony contract."
    fi

    cleanup_folder
    stop_host
    printf '%s\n' "$host cross-host contract passed."
done

printf '%s\n' 'Cross-host HTTP parity passed for Symfony, Laravel, Slim, Mezzio and plain PHP.'
