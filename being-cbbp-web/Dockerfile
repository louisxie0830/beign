FROM node:lts as builder

ARG NODE_ENV=production
ARG VUE_APP_PREVIEW=false
ARG VUE_APP_API_BASE_URL=/api
ARG BASE_URL=/

WORKDIR /app
RUN apt-get update && apt-get install git python make build-essential -y
RUN npm install -g node-gyp
COPY package*.json ./
ENV NPM_CONFIG_LOGLEVEL=error
# Install app dependencies
RUN NODE_ENV=development npm install
# Bundle app source
COPY . .
# build app for production with minification
RUN npm run build

FROM nginx:alpine
#replace default virtual host config
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker.entrypoint.sh /docker.entrypoint.sh
RUN chmod +x /docker.entrypoint.sh
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["/docker.entrypoint.sh"]
