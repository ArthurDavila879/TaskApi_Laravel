#!/bin/sh
set -e

# O volume nomeado "vendor" começa vazio; instala as dependências
# automaticamente no primeiro start (ou sempre que faltar o autoload).
if [ ! -f /var/www/vendor/autoload.php ]; then
    echo "vendor/ ausente — rodando composer install..."
    composer install --no-interaction --no-progress --prefer-dist --optimize-autoloader
fi

# Gera a APP_KEY automaticamente se ainda não existir
if [ -f /var/www/artisan ] && [ -z "$(grep -E '^APP_KEY=.+' /var/www/.env 2>/dev/null)" ]; then
    echo "APP_KEY ausente — gerando..."
    php artisan key:generate --force
fi

exec "$@"
