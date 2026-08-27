FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libicu-dev \
        libonig-dev \
        libzip-dev \
        unzip \
        git \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        intl \
        mbstring \
        pdo_mysql \
        pcntl \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]