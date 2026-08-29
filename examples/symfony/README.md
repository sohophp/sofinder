# Symfony compatibility example

Choose one tested dependency line, then install and run. The example resolves
the compatibility Meta Package, Symfony Bridge, Core, HTTP and S3 adapter from
their physical package directories in the current checkout:

```bash
cp composer-7.4.json composer.json
../../scripts/composer.sh install
mkdir -p var/storage
test -e public/uploads || ln -s ../var/storage public/uploads
../../scripts/php-bin.sh bin/console cache:warmup
../../scripts/php-bin.sh bin/console sofinder:security:audit
../../scripts/php-bin.sh -S 127.0.0.1:8080 -t public public/index.php
```

Use `composer-6.4.json` for Symfony 6.4. Browse `/sofinder/browser` and sign in
with `demo` / `demo`. These credentials and the plaintext hasher are for this
local example only.

Repository CI runs `scripts/check-symfony-example-http.sh` against this app.
The black-box smoke verifies anonymous rejection, HTTP Basic authentication,
session CSRF, upload/download byte parity, Range responses, security headers
and compiled asset delivery. A separate Chromium Playwright smoke boots this
same application and verifies the real React browser shell and configuration API.

CI also installs the matching optional `symfony/messenger` line and warms the
`messenger` environment. Its in-memory transport proves that maintenance and
document-preview messages can be routed asynchronously without making Messenger
a mandatory dependency of the bridge.

Open `/integrations` for a live CKEditor 5, TinyMCE 8, TipTap, Quill 2, wangEditor 5, Jodit 4 and plain
form integration matrix. The editors load from their official/documented CDN
endpoints, while `sofinder-picker.js` and SoFinder itself are served from this
checkout. The page therefore tests the actual local PHP routes and compiled SDK;
internet access is needed only for the third-party editor runtimes. The demo
pins CKEditor 5 Classic, TinyMCE 8 GPL, TipTap, Quill, wangEditor and Jodit CDN versions and needs
no cloud API key; review each editor's license and self-host or update the pinned
versions before using them in an application.

In the `dev` environment only, the example registers
`App\Plugin\FileInspectorPlugin`, a complete first-party reference for
third-party extensions. Right-click a file in SoFinder and choose **Inspect
file**. Its same-origin host route receives the selection, resolves it again
through `FileManager` (therefore repeating authorization), and renders only
escaped metadata. The same plugin implements `HealthCheckInterface`, so it also
appears in `/sofinder/health`. Production and non-demo environments do not
register this action or its route.

PDF and Office previews are enabled in the example. `/sofinder/health` must
report `document-preview: ready`; Office files are converted to private cached
PDFs by `/usr/bin/libreoffice`. ClamAV is deliberately disabled until a local
clamd listens on `tcp://127.0.0.1:3310`. Then set
`SOFINDER_CLAMAV_ENABLED=1`, restart the example and verify both
`/sofinder/health` and `/sofinder/api/security/status`. A normal upload must
increase `passed`; an official EICAR test upload must be rejected and increase
`quarantined`.

The `public/uploads` link exposes the example's `var/storage` directory at the
configured `/uploads` URL. On WSL, bind the development server to all WSL IPv4
interfaces so a Windows browser can use the distro hostname:

```bash
php85 -S 0.0.0.0:8080 -t public
```

## Browser testing with S3

The example can load S3 configuration from `.env.local`, just like a normal
Symfony application. Copy the template, enter credentials for a non-production
bucket, and keep `APP_ENV=s3`. The committed `.env` contains only safe defaults
required by Symfony Runtime; `.env.local` overrides it and remains ignored:

```bash
cd examples/symfony
cp .env.example .env.local
# Edit .env.local without committing it.
php85 /usr/local/bin/composer update sohophp/sofinder-s3 symfony/dotenv --with-dependencies
php85 bin/console cache:clear
php85 -S 0.0.0.0:8080 -t public
```

Open `http://rocky.wsl:8080/sofinder/browser`, sign in with `demo` / `demo`,
and switch between local `Files` / `Images` and remote `S3Files`. The `dev`
environment exposes only `Files`; the `s3` environment exposes those three for
integration testing. Local `Images` uses private proxy delivery, so it does not
need another public symlink. `S3Files` uses `SOFINDER_PROVIDER_PREFIX`. The same
`SOFINDER_PROVIDER_*` values used by the package smoke test can be copied
without renaming. Backblaze B2 should use its regional HTTPS endpoint and
`SOFINDER_PROVIDER_USE_PATH_STYLE_ENDPOINT=0`.

The normal `s3` environment intentionally registers only one remote provider.
To demonstrate two providers, set `APP_ENV=s3_dual` and configure every required
`SOFINDER_PROVIDER_*2` value from `.env.example`. A missing optional second
provider never prevents the normal `s3` browser from starting.

There is no fixed limit or prescribed naming for S3 resources. Add another
entry under `so_finder.resources` in `config/packages/s3/so_finder.yaml` for
each bucket or prefix. Resource names such as `BackblazeFiles`, `MediaArchive`,
or `CustomerUploads` are application-defined. Connection options may reuse the
same environment variables or reference a separate set for another provider,
bucket, or restricted key. For example:

```yaml
so_finder:
  resources:
    AnyResourceName:
      adapter: s3
      root: '%env(ANY_S3_PREFIX)%'
      public_url: ''
      delivery_mode: proxy
      allowed_extensions: [jpg, jpeg, png, webp]
      roles: [ROLE_USER]
      options:
        bucket: '%env(ANY_S3_BUCKET)%'
        region: '%env(ANY_S3_REGION)%'
        endpoint: '%env(ANY_S3_ENDPOINT)%'
        use_path_style_endpoint: false
        access_key_id: '%env(ANY_S3_ACCESS_KEY)%'
        secret_access_key: '%env(ANY_S3_SECRET_KEY)%'
```

Repeat that block as many times as needed. Keep resource structure in YAML and
credentials in `.env.local`. A Backblaze key restricted to one prefix cannot be
reused for another prefix unless its permissions cover both.

### Public or CDN URLs

Private resources should keep `delivery_mode: proxy` and an empty `public_url`;
copied links then use SoFinder's authenticated content API. For a public bucket
or CDN, set `delivery_mode: public` and configure `public_url` as the browser
base URL corresponding to that resource's `root`. The adapter appends the
logical object path to this base. For example, when `root` is
`component-images`:

```dotenv
SOFINDER_PROVIDER_PUBLIC_URL=https://cdn.example.com/component-images
```

and set the matching YAML resource to `delivery_mode: public`. Keep the YAML
value as `proxy` when the URL is empty or the bucket is private.

The local `Files` and `Private` examples deliberately use different physical
directories. Never point a public and a proxy resource at the same root: the
public web-server mapping would bypass the private resource's controller and
authorization checks. The `Private` example starts empty and does not copy data
from `Files`.

Additional resources may use any environment variable names referenced by
their YAML blocks, for example `ARCHIVE_PUBLIC_URL` or `CUSTOMER_CDN_URL`.

### Application-owned file routes

An application can make copied, preview, and download URLs point at one of its
own routes instead of SoFinder's content API. The `S3Files` example uses the
included `example.file.output` route:

```yaml
entry_url:
  route: example.file.output
  absolute: true
  parameters:
    resource: '{resource}'
    name: '{name}'
    path: '{path}'
    disposition: inline
```

`HostFileController` validates access through `FileManager`, then streams the
object with the configured MIME type and disposition. Adding `redirect=1` lets
the same controller redirect to the adapter's public/CDN URL when one is
available; private resources continue to stream through the application. The
route is protected by the example's normal `ROLE_USER` access rule.

Real applications can replace the built-in placeholders with values supplied
by an `EntryUrlContextProviderInterface` implementation. For example, a host
provider can look up a database row by the entry's storage key and return its
`id`, allowing route parameters such as `id: '{id}'` and `name: '{name}'` for a
route like `/file/download/{id}-{name}`.

The example's root autoload mappings read SoFinder and S3 PHP classes from the
current checkout, so PHP and committed `dist/` changes are visible without
publishing or reinstalling either package. After changing the frontend, build
`dist/` first.
Clear the example cache when PHP services, configuration, or `dist/` changed:

```bash
cd frontend
pnpm build
cd ../examples/symfony
php85 bin/console cache:clear
```
