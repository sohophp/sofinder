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

To expose a second S3 prefix, fill the `SOFINDER_PROVIDER_IMAGES_*` variables
and set `APP_ENV=s3_multi`. This adds `S3Images` while retaining `Files`,
`Images`, and `S3Files`. A Backblaze application key restricted to
`component-files` cannot read `component-images`; use a second prefix-restricted
Images key, or copy a bucket-wide key into both credential sets.

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
