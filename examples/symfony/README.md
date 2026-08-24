# Symfony compatibility example

Choose one tested dependency line, then install and run. The example resolves
SoFinder and its S3 adapter from the current checkout at runtime. Composer uses
the remote core development package only to resolve dependencies; the root PSR-4
mapping takes precedence and loads the current checkout instead:

```bash
cp composer-7.4.json composer.json
php85 /usr/local/bin/composer install
mkdir -p var/storage
test -e public/uploads || ln -s ../var/storage public/uploads
php85 bin/console cache:warmup
php85 bin/console sofinder:security:audit
php85 -S 127.0.0.1:8080 -t public
```

Use `composer-6.4.json` for Symfony 6.4. Browse `/sofinder/browser` and sign in
with `demo` / `demo`. These credentials and the plaintext hasher are for this
local example only.

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
