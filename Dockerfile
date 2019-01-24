FROM node:10.14.2

WORKDIR /usr/src/pic2voice-api

COPY ./ ./

RUN npm install

CMD ["npm", "start"]
