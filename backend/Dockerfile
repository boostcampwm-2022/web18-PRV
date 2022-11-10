FROM node:18
WORKDIR /viewpoint/server
COPY package.json .
RUN npm i
COPY . .
CMD npm start:prod
