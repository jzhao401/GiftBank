FROM node:18.12.1-bullseye-slim

WORKDIR /app

COPY package*.json ./

COPY logger.js ./

COPY app.js ./

COPY envs ./

COPY models ./models

COPY routes ./routes

COPY util ./util

RUN npm install

EXPOSE 3060

CMD ["node", "app.js"]