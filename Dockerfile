FROM node:20.10.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install http-server
COPY . .
RUN npm run build
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
EXPOSE 80