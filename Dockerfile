FROM node:6.10

MAINTAINER Michael Walters, mike@eventbooking.com

# make /etc read-only (like Lambda)
RUN chmod 0444 /etc

WORKDIR /var/task

RUN echo '{ "allow_root": true }' > /root/.bowerrc

ADD package.json package.json
ADD bower.json bower.json

RUN npm install --unsafe-perm

ADD ./bin/wkhtmltopdf ./bin/wkhtmltopdf
RUN chmod +x ./bin/wkhtmltopdf

ADD index.js index.js
ADD styles.css styles.css
ADD scripts.js scripts.js
ADD ./fontconfig ./fontconfig

# kerning fix
ENV LD_LIBRARY_PATH='/tmp/fontconfig/usr/lib/'
RUN cp -r ./fontconfig /tmp
RUN chmod +x /tmp/fontconfig/usr/bin/fc-cache
RUN /tmp/fontconfig/usr/bin/fc-cache