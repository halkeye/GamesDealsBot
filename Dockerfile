# Original Source: https://codefresh.io/docker-tutorial/node_docker_multistage/
#
# ---- Base Node ----
FROM node:13-alpine AS base
# install node
RUN apk add --no-cache tini
# set working directory
WORKDIR /home/node
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json package-lock.json ./
#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm ci --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
RUN rm -rf prod_node_modules
RUN npm run lint && npm run test

#
# ---- Release ----
FROM base AS release
# Set production env
ENV NODE_ENV=production
USER node
WORKDIR /home/node
# copy production node_modules
COPY --chown=node --from=dependencies /home/node/prod_node_modules ./node_modules
# copy app sources
COPY --chown=node . .
RUN rm -rf __tests__/ __mocks__/ jest.setup.js .eslintrc.js
# Default startup command
CMD ["npm", "run","start"]
