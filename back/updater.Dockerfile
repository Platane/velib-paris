FROM debian:latest
MAINTAINER platane

# curl
RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash \
&& apt-get install -y nodejs


ADD ./package.json /app/

WORKDIR /app

RUN npm install --production

ADD ./dist/ /app/

CMD node /app/updater.start.js
