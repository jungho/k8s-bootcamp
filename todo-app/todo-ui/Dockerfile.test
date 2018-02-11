## --- End 2 End Test Container ---
# Runs end 2 end tests against a given host for the todo-ui leveraging a headless chrome browser.
#
# Environment Variables:
# APPLICATION_BASE_URL: The path to the context root of the application. Eg: `http://todo-ui:80`
##

# Base of NodeJS and Debian
FROM node:8.9.1-stretch AS build

# TODO: Lock down specific Chrome version
# Latest Google Chrome installation package
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

# TODO: Lock down specific JRE version
# Latest Google Chrome and JRE to run webdriver
RUN apt-get update -qqy \
  && apt-get -qqy install \
    google-chrome-stable \
    default-jre

# set working directory
WORKDIR /root/todo-app

# copy package files as indicator if layer with dependencies should re-run.
COPY ./package.json .
COPY ./yarn.lock .

# install yarn and project dependencies
RUN npm i -g yarn@1.3.2 && yarn install

# Get webdriver-manager to download specific chrome driver
RUN yarn webdriver update --versions.chrome 2.34

# copy the rest of the project
COPY . .

ENV TEST_ENV=container

CMD ["yarn","e2etest"]

