FROM NODE:16 

RUN apt update && \
	apt-get install certbot python3-certbot-nginx && \
	certbot --nginx -d wreflect.azurewebsites.net 

RUN cp -r /etc/letsencrypt/live/wreflect.azurewebsites.net ./wreflect.azurewebsites.net 



