# Repository execution rules

- The local development PHP version is declared in `.php-version`.
- Never invoke an unqualified `php` or `composer` command in this repository.
- Run PHP commands through `./scripts/php-bin.sh`.
- Run Composer commands through `./scripts/composer.sh`.
- `composer.json`'s `config.platform.php` remains the minimum dependency-resolution target; it does not select the local interpreter.
