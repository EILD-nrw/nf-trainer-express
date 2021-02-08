FROM node:fermium

WORKDIR /app

COPY src/package*.json ./

RUN npm install

COPY . .
