# Symfony compatibility example

Choose one tested dependency line, then install and run. The example resolves
SoFinder from the current checkout through a Composer path repository and does
not require a tagged release:

```bash
cp composer-7.4.json composer.json
composer install
php bin/console cache:warmup
php bin/console sofinder:security:audit
php -S 127.0.0.1:8080 -t public
```

Use `composer-6.4.json` for Symfony 6.4. Browse `/sofinder/browser` and sign in
with `demo` / `demo`. These credentials and the plaintext hasher are for this
local example only.

After changing PHP source, reinstall the local path package. After changing the
frontend, build `dist/` first. Then clear the example cache before refreshing:

```bash
cd frontend
pnpm build
cd ../examples/symfony
composer reinstall sohophp/sofinder --no-interaction
php bin/console cache:clear
```
