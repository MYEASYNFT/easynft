FROM node:lts-alpine

ENV NODE_ENV=production

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD ./ /usr/src/app
WORKDIR /usr/src/app

RUN npm config set registry https://registry.npm.taobao.org && npm install --only-production

EXPOSE 80
CMD npm run start