#!/bin/bash
 
# Phase 1
sudo docker compose -f docker-compose-initiate.yml up -d nginx
sudo docker compose -f docker-compose-initiate.yml up certbot
sudo docker compose -f docker-compose-initiate.yml down
 
# some configurations for let's encrypt
# curl -L --create-dirs -o ./etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
sudo openssl dhparam -out etc/letsencrypt/ssl-dhparams.pem 2048
 
# Phase 2
# crontab /etc/crontab
sudo docker compose -f docker-compose-prod.yml -d up