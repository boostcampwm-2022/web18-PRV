FROM nginx
WORKDIR /app

COPY ./package.json .
RUN npm i
COPY . .
RUN npm run build
COPY ./dist ./dist

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]