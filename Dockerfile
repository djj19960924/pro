FROM bitnami/nginx:latest

#COPY nginx.conf /etc/nginx/nginx.conf
#COPY nginx.vh.default.conf /etc/nginx/conf.d/default.conf
COPY  my_vhost.conf /opt/bitnami/nginx/conf/my_vhost.conf
COPY . /app

#EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]