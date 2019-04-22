FROM node:8.16.0

MAINTAINER Michael Walters, mike@eventbooking.com

RUN apt-get update
RUN apt-get install -yq zip pdftk gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
fonts-ipafont-mincho fonts-ipafont-gothic fonts-unfonts-core fonts-arphic-ukai fonts-arphic-uming 

WORKDIR /home

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

ADD package.json package.json
ADD bower.json bower.json
ADD postinstall.js postinstall.js
ADD bin bin
ADD fontconfig fontconfig

RUN npm install --unsafe-perm