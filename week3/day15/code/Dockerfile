FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p logs

EXPOSE 3000

CMD ["node", "server/index.js"]