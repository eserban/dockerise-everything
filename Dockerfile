FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package*.json*", "./"]

RUN npm ci && npm install -g nodemon

COPY . .

CMD ["npm", "run", "start-dev"]