FROM node:lts-alpine
USER root
WORKDIR /bot
COPY package*.json ./
COPY . ./
RUN npm ci
RUN npm run build
RUN rm -r -f src
RUN rm -r -f node_modules
RUN npm ci --omit=dev

ENTRYPOINT [ "node", "build/bot.js" ]