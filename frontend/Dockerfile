## BUILD
# docker build -t myfrontend:0.1.0-alpine .
## RUN
# docker run -d -p 8888:80 myfrontend:0.1.0-alpine

FROM node:18.12.1-alpine3.17 as compilacion

LABEL developer="susguzma@gmail.com"

ENV REACT_APP_BACKEND_BASE_URL=http://localhost:3800

# Copiando mi applicacion
COPY . /opt/app

WORKDIR /opt/app

RUN npm install

RUN npm run build

## Fase 2

FROM nginx:1.22.1-alpine

COPY --from=compilacion /opt/app/build /usr/share/nginx/html
