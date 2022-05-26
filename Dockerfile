# FROM node:14
# WORKDIR /nodejs-postgresql
# COPY package.json .
# RUN npm install
# # RUN npm run migrate up
# COPY . .
# CMD npm start


FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the Tweet Sentiment Analysis backend API."
LABEL maintainer = ["danielmurph8@gmail.com", "dylanedwards290@gmail.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install --production
COPY . .

EXPOSE 9000

CMD npm start