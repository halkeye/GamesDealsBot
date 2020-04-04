FROM node:13
USER node
WORKDIR /home/node
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "run","start"]
