FROM nginx:alpine

RUN apk add --no-cache --repository http://nl.alpinelinux.org/alpine/edge/main libuv \
    && apk add --no-cache --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main nodejs=16.14.2-r0 npm=8.1.3-r0 \
    && echo "NodeJS Version:" "$(node -v)" \
    && echo "NPM Version:" "$(npm -v)"

WORKDIR /usr/src/app

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY package*.json ./

RUN npm i

COPY ./ ./

RUN npm run build
