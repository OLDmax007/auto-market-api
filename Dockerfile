FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install && npm install -g tsx

COPY backend/ .

EXPOSE 5000

CMD ["tsx", "src/main.ts"]