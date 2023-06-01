# Wreflect
## Introduction
 
 This website is allow team can manage their tasks, tracking time and reflect their result after one or several weeks 

## Installation

### Development environment

```bash
git clone https://github.com/ThanhTanNguyen2007/wReflect.git
```

#### Client installation
Make sure you are in Client folder
```bash
yarn --pure-lockfile
```
```bash
yarn start
```

#### Server installation

- Make sure you are in Serve folder
- Make sure you already have posgresql installed in your local machine with having posgres user and password configured like .evn.development

````bash
yarn --pure-lockfile
````
````bash
yarn migrate
yarn generate-prisma-client
yarn dev
````

### Production environment
Make sure you have docker and docker-compose in your local machine

Change .env file in both client and server folders with suitable urls 

#### Docker setup

````bash
docker-compose build
docker-compose up -d
````

#### Duckdns setup (optional)

- Create account and login in duckdns

- Add your domain name that you wanted (for me i create wreflect.duckdns.org)

- Copy token in duckdns
![duckdns](Screenshot%202023-06-01%20at%2012.17.16.png "Duck DNS")

- Go to your terminal in host machin (i use bash)

- Install certbot 
```bash
sudo apt update
sudo apt install snapd
sudo snap install certbot --classic
sudo snap install certbot-dns-duckdns
```
- Follow the instructions

```bash
mkdir duckdns_credentials.ini
vim duckdns_credentials.ini
```

- Replace <yourtoken> to your token 
```ini
dns_duckdns_token = <yourtoken>
```

- Run this command

```bash
sudo certbot certonly --dns-duckdns-credentials ~/duckdns_credentials.ini -d <your domain name>
```

#### Nginx setup

Make sure install nginx in your host machine

```bash
sudo nano /etc/nginx/sites-available/default
```
or
```bash
sudo vim /etc/nginx/sites-available/default
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
		# Change http://4.193.194.60 to your host machine publis ip
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
		# Change http://4.193.194.60 to your host machine publis ip
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


