

# BUILD
# docker build -t myapp:0.1.0-ubuntu -f 1.dockerfile .

# RUN
# docker run -d -p 8080:80 -e PORT=6000 myapp:0.1.0-ubuntu

FROM ubuntu:20.04

LABEL ower="Jesus Guzman" \
      email="susguzman@gmail.com" \
      team="dev"

ENV HOLA=mundo \
    PORT=5000

RUN apt-get update -y

RUN apt-get install -y nginx

COPY index.html /var/www/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
