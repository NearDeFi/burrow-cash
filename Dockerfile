FROM node:14-alpine

ENV PARCEL_WORKERS=1

RUN apk add --no-cache git

COPY . ./app

WORKDIR ./app

RUN yarn global add serve
RUN yarn install --frozen-lockfile --network-timeout 1000000
RUN yarn parcel build src/index.html --public-url ./

EXPOSE 1234

ENTRYPOINT serve -s -l tcp://0.0.0.0:1234 dist
