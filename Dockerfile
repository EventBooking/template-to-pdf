FROM node:4.3

MAINTAINER Michael Walters, mike@eventbooking.com

RUN apt-get update
RUN apt-get install zip -y

WORKDIR /home

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

ADD package.json package.json
RUN npm install

ADD bower.json bower.json
RUN bower install

ADD ./bin /home/bin
ADD index.js index.js
ADD styles.css styles.css