FROM node:8.1
MAINTAINER Mahan Hazrati<eng.mahan.hazrati@gmail.com>

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

RUN apt-get update && apt-get -y upgrade

RUN apt-get -y install  build-essential \
                        libmysqlclient-dev \
                        libssl-dev \
                        git \
                        curl \
                        libmp3lame-dev \
                        libvorbis-dev \
                        libtheora-dev \
                        libspeex-dev \
                        yasm \
                        pkg-config \
                        libopenjpeg-dev \
                        libx264-dev

RUN mkdir software && \
    cd software && \
    wget http://ffmpeg.org/releases/ffmpeg-3.2.2.tar.bz2 && \
    cd .. && \
    mkdir src && \
    cd src && \
    tar xvjf ../software/ffmpeg-3.2.2.tar.bz2 && \
    cd ffmpeg-3.2.2 && \

    ./configure \
        --enable-gpl \
        --enable-postproc \
        --enable-swscale  \
        --enable-avfilter  \
        --enable-libmp3lame  \
        --enable-libvorbis  \
        --enable-libtheora  \
        --enable-libx264  \
        --enable-libspeex  \
        --enable-shared  \
        --enable-pthreads  \
        --enable-libopenjpeg \
        --enable-nonfree && \
    make && \
    make install && \
    /sbin/ldconfig
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
        --no-daemon npm start \
        --watch \
        --silent \
        --no-vizion \
        --instances 1 \
        --ignore-watch "tmp/* .pm2 .config"

EXPOSE 80
