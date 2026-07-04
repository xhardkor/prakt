FROM node:24-alpine as build
WORKDIR /dir

COPY ./back/package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

ENTRYPOINT [ "node", "./back/index.ts" ]
