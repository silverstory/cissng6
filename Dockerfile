# Client App
FROM node:8.10.0 as client-app
USER node
LABEL authors="Eprel"
RUN mkdir /home/node/.npm-global ; \
  mkdir -p /home/node/app ; \
  chown -R node:node /home/node/app ; \
  chown -R node:node /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
RUN npm install --silent --no-progress -g @angular/cli@1.7.2
WORKDIR /home/node/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --silent
COPY . .
RUN ng build --prod --build-optimizer
RUN npm cache clean --force

# Node server
FROM node:8.10.0 as node-server
WORKDIR /usr/src/app
COPY ["./src/server/package.json", "./src/server/package-lock.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY ./src/server /usr/src/app

# Final image
FROM node:8.10.0
WORKDIR /usr/src/app
COPY --from=node-server /usr/src /usr/src
COPY --from=client-app /home/node/app/dist ./
EXPOSE 3000
CMD ["node", "index"]
