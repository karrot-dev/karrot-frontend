ARG NODE_VERSION=20
ARG NGINX_VERSION=1.24

FROM docker.io/node:${NODE_VERSION} as build

WORKDIR /app/code

COPY package.json yarn.lock /app/code

RUN yarn

COPY . /app/code

RUN yarn build

#--------------------------------------

FROM docker.io/nginx:${NGINX_VERSION}

COPY --from=build /app/code/dist/pwa /usr/share/nginx/html

COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
