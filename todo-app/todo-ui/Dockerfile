#Based on the multi-stage build example by codefresh.io
#https://codefresh.io/blog/node_docker_multistage/

# ---- Build Node ----
FROM node:8.9.1-alpine AS build
# set working directory
WORKDIR /root/todo-app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy package files as indicator if layer with dependencies should re-run.
COPY ./package.json .
COPY ./yarn.lock .

# install yarn and project dependencies
RUN npm i -g yarn@1.3.2 && yarn install

# copy the rest of the project, test and build
COPY . .
RUN  CI=true yarn test && yarn build

#
# ---- Release Node ----
FROM nginx:1.13.7
WORKDIR /app
# copy production build output from build node
COPY --from=build /root/todo-app/build .

COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template

STOPSIGNAL SIGTERM

# Empty config array
ENV REACT_APP_CLIENT_ID ""
ENV REACT_APP_TENANT ""
ENV REACT_APP_TEST_MODE "false"

# run nginx
CMD envsubst '\$REACT_APP_CLIENT_ID \$REACT_APP_TEST_MODE \$REACT_APP_TENANT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'


