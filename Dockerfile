FROM node:14.16.0 As development

WORKDIR /site-walker/app

COPY package*.json ./

RUN npm install
RUN npm install argon2 --build-from-source

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

################
## PRODUCTION ##
################

FROM node:14.16.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /site-walker/app

COPY package*.json ./
RUN apk add --no-cache --virtual .gyp python make g++ \ 
    && npm install --only=production \
    npm install argon2 --build-from-source \
    && apk del .gyp
# RUN npm install --only=production
# RUN npm install argon2 --build-from-source

COPY . .

COPY --from=development /site-walker/app/dist ./dist

CMD ["node", "dist/main"]
