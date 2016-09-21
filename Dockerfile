FROM mhart/alpine-node:4.5

MAINTAINER Mahan hazrati<eng.mahan.hazrati@gmail.com>

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

WORKDIR /var/app/server

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
