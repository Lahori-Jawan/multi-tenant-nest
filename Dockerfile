FROM node:14.16.0 As development

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install argon2 --build-from-source

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

################
## PRODUCTION ##
################

FROM node:14.16.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
RUN npm install argon2 --build-from-source

COPY . .

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]
