# Wreflect
## Introduction
 
 This website is allow team can manage their tasks, tracking time and reflect their result after one or several weeks 

## Installation

### Development environment

```bash
git clone https://github.com/ThanhTanNguyen2007/wReflect.git
```

```bash
cd wReflect
yarn install 
```

### Production environment
Make sure you have docker and docker-compose in your local machine

Change .env file in both client and server folders with suitable urls 

````bash
docker-compose build
docker-compose up -d
````

Make sure install nginx in your host machine

```bash

```

```conf
server {
    listen 80;
    server_name wreflect.southeastasia.cloudapp.azure.com;
    return 301 https://$host$request_uri;


}

server {
    listen 80;
    server_name wreflect.duckdns.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name wreflect.southeastasia.cloudapp.azure.com;
    ssl_certificate /etc/letsencrypt/live/wreflect.southeastasia.cloudapp.azure.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wreflect.southeastasia.cloudapp.azure.com/privkey.pem; # managed by Certbot
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";

    location / {
        proxy_pass http://4.193.194.60:3000; # Make sure this port matches your app's listening port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}

server {
    listen 443 ssl;
    server_name wreflect.duckdns.org;
    ssl_certificate /etc/letsencrypt/live/wreflect.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wreflect.duckdns.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";

    location / {
        proxy_pass http://4.193.194.60:4000; # Make sure this port matches your app's listening port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /graphql {
        proxy_pass http://4.193.194.60:4000/graphql;  # Replace this with your backend server's address
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

}
```