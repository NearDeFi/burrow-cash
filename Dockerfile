FROM node:14-alpine

RUN apk add --no-cache git

COPY . ./app

WORKDIR ./app

RUN yarn install --frozen-lockfile --network-timeout 1000000

ENV PARCEL_WORKERS=1
ENV NODE_ENV=production

EXPOSE 1234

ENTRYPOINT yarn prod
