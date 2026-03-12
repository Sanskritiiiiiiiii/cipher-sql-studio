FROM node:20-alpine

WORKDIR /app/backend

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8002

CMD ["node", "server/server.js"]
