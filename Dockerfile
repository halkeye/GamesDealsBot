FROM node:13
USER node
WORKDIR /home/node
ENV NODE_ENV=production
COPY --chown=node package.json package-lock.json ./
RUN npm ci
COPY --chown=node . .
CMD ["npm", "run","start"]
