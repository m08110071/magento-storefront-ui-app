# Adobe Commerce (Magento) and Storefront-Ui (React) on Docker

## Introduction

This repository is an **Cloud Native solution** powered by manhtranpro@gmail.com, it simplifies the complicated installation and initialization process.

## System Requirements

The following are the minimal [recommended requirements](https://devdocs.magento.com/cloud/docker/docker-development.html#prerequisites):

* **Docker Engine**: Latest version
* **RAM**: 6 GB or more
* **CPU**: 2 cores or higher
* **HDD**: at least 20 GB of free space
* **Swap file**: at least 1 GB
* **bandwidth**: more fluent experience over 100M

## QuickStart

### Installation
We assume that you are already familiar with Docker, and you can modify [docker-compose file](docker-compose.yml) by yourself

```
git clone --depth=1 https://github.com/m08110071/magento-storefront-ui-app.git
cd magento-storefront-ui-app
docker compose  up -d
```

### Verify Storefront
Storefront-UI: http://localhost:3000

### Install Magento extensions
Issue:
- CORS

Solution:
- Install extension to config header response of API

#### Step 1: Log into the container shell as root
```
docker exec -it magento /bin/bash
```

#### Step 2: Login as the web server user

```
su daemon -s /bin/bash
```

#### Step 3: Change directory to the Magento root

```
cd /bitnami/magento
```

#### Step 4: Install extension

Composer may require to enter Magento repository access key. If you have no access key, you can create one in the [Magento Marketplace](https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/prerequisites/authentication-keys).
```
composer require graycore/magento2-cors
php bin/magento module:enable Graycore_Cors
```

#### Step 5: Import default CORS config
You may need to install vi for docker container to edit file
```
apt-get update
apt-get install vim
```
After install vi, you can edit file. Now let edit `app/etc/env.php` file and add below CORS config
```
<?php
return [
    ...
    'system' => [
        'default' => [
            'web' => [
                'graphql' => [
                    'cors_allowed_origins' => '*',
                    'cors_allowed_methods' => 'POST, OPTIONS',
                    'cors_allowed_headers' => '*',
                    'cors_max_age' => '86400',
                    'cors_allow_credentials' => 1
                ]
            ]
        ]
    ]
    ...
];
```

Now you run below commands to apply changes
```
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
```

Workaround to pass file permission issue
```
chmod -R 777 .
```

Magento instance is now available at http://localhost:8081. You can log in to the admin panel at http://localhost:8081/admin with the default credentials:`admin/admin123`

You can add some simple products to test the storefront
