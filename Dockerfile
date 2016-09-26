FROM ubuntu:16.04
MAINTAINER Mahan Hazrati<eng.mahan.hazrati@gmail.com>

ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install  build-essential \
                        libssl-dev \
                        git \
                        curl && \
                        apt-get clean

# install nodejs v4.5
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash
RUN /bin/bash -c "source ~/.profile"
RUN nvm install v4.5

WORKDIR /var/app/api

RUN npm install
RUN npm install pm2 -g

EXPOSE 80

ENTRYPOINT ["pm2", "start", "app.js"]
