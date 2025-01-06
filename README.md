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

Step 1: Log into the container shell as root
```
docker exec -it magento /bin/bash
```

Step 2: Login as the web server user

```
su daemon -s /bin/bash
```

Step 3: Change directory to the Magento root

```
cd /bitnami/magento
```

Step 4: Install extension
```
composer require @graycore/magento2-cors
php bin/magento module:enable <extension name>
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

