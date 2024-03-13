ARG NODE_VERSION=20
ARG NGINX_VERSION=1.25

FROM docker.io/node:${NODE_VERSION} as build

COPY . /app/code

WORKDIR /app/code

RUN yarn
RUN yarn build

#--------------------------------------

FROM docker.io/nginx:${NGINX_VERSION}-alpine

LABEL org.opencontainers.image.source=https://github.com/karrot-dev/karrot-frontend

COPY --from=build /app/code/dist/pwa /usr/share/nginx/html

COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
