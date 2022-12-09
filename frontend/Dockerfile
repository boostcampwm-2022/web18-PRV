FROM node:18 as builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN --mount=type=secret,id=REACT_APP_BASE_URL \ 
    export REACT_APP_BASE_URL=$(cat /run/secrets/REACT_APP_BASE_URL) && \
    echo "REACT_APP_BASE_URL=$REACT_APP_BASE_URL" >> .env.production
RUN ls -al
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/statics
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]