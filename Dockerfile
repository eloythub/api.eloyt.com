FROM node:6.9.1
MAINTAINER Mahan Hazrati<eng.mahan.hazrati@gmail.com>

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install  build-essential \
                        libmysqlclient-dev \
                        libssl-dev \
                        git \
                        curl


RUN npm install -g pm2 yarn

ENV TMP_DIR=/tmp
ENV PROD_DIR=/opt/app

RUN mkdir -p $TMP_DIR
COPY yarn.lock $TMP_DIR/yarn.lock
COPY package.json $TMP_DIR/package.json
RUN cd $TMP_DIR && yarn

WORKDIR $PROD_DIR

CMD cd $PROD_DIR && \
	ln -sf /tmp/node_modules && \
	rm -rf .pm2 && \
    pm2 start \
        --no-daemon ./app.js \
        --watch \
        --ignore-watch "tmp/* .pm2 .config"

EXPOSE 80
