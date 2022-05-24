FROM node:16 as build
WORKDIR /frontend
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN yarn build


FROM nginx:alpine
COPY --from=build /frontend/build /usr/share/nginx/html 
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
