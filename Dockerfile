FROM lambci/lambda:build-nodejs4.3
# FROM node:4.3

MAINTAINER Michael Walters, mike@eventbooking.com

# make /etc read-only (like Lambda)
RUN chmod 0444 /etc

WORKDIR /var/task

RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD package.json package.json
ADD bower.json bower.json

RUN npm install

ADD ./bin/wkhtmltopdf ./bin/wkhtmltopdf
RUN chmod +x ./bin/wkhtmltopdf

ADD index.js index.js
ADD styles.css styles.css
ADD scripts.js scripts.js
ADD ./fontconfig ./fontconfig