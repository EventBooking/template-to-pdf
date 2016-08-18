FROM node:6-onbuild

MAINTAINER Michael Walters, mike@eventbooking.com

WORKDIR /home

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

ADD package.json package.json
RUN npm install

ADD bower.json bower.json
RUN bower install

ADD index.js index.js