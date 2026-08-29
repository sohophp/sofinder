# SoFinder Laravel example

This runnable application exercises package auto-discovery and the complete
Laravel 12/13 SoFinder bridge. It uses a request guard and permissive Gate only
for local demonstration; production applications must use their real Auth and
Gate policies.

From this directory, copy `.env.example` to `.env`, install dependencies through
`../../scripts/composer.sh install`, then start it with
`../../scripts/php-bin.sh artisan serve --host=127.0.0.1 --port=18083`.
Open `http://127.0.0.1:18083/sofinder/browser`.

Use `composer-12.json` on PHP 8.2–8.5 and `composer-13.json` on PHP 8.3–8.5.
