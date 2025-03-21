
FROM node:18-apline

WORKDIR /app/backend-nestjs

COPY package*.json ./

RUN npm install --force

RUN npm i -g @nestjs/cli

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]