/* eslint-disable no-await-in-loop */
const axios = require('axios');
const db = require('./lib/db.js');
const logger = require('./lib/logger.js');
const isFree = require('./lib/isFree.js');
const models = require('./models');
const Deal = require('./models/Deal');
const Webhook = require('./models/Webhook');

const REDDIT_LOOKUP_MODE = process.env.REDDIT_LOOKUP_MODE || 'hot';
const REDDIT_LIMIT = process.env.REDDIT_LIMIT || 10;

const createMessageContent = (deals) => deals.map((deal) => deal.createMessage());

async function main() {
  await db.authenticate();
  for (const model of Object.values(models)) {
    await model.sync();
  }

  const response = await axios.get(`https://www.reddit.com/r/GameDeals/${REDDIT_LOOKUP_MODE}/.json?limit=${REDDIT_LIMIT}`);
  if (response.status === 200) {
    const threads = response.data.data.children;
    const dealsToBroadcast = [];
    for (const thread of threads) { // eslint-disable-line no-restricted-syntax
      const {
        data: {
          id, url, title, author,
        },
      } = thread;

      if (!isFree(title)) {
        logger.debug(`[${id}] ${title} is not free`);
        continue;
      }

      const getThreadFromDatabase = await Deal.findOne({
        where: { thread_id: id },
      });

      if (!getThreadFromDatabase) {
        const deal = new Deal({
          thread_id: id,
          title,
          url,
          author,
        });
        await deal.save();
        dealsToBroadcast.push(deal);
      }
    }

    logger.debug(dealsToBroadcast);
    if (dealsToBroadcast.length > 0) {
      const message = createMessageContent(dealsToBroadcast);
      try {
        await Webhook.postMessage(message);
        logger.info('ACCEPTED');
      } catch (e) {
        logger.warn(`Something went wrong during webhooks execution. Response status ${e.stack}`);
      }
    }
  }
}

main().then(() => db.close()).catch((e) => logger.error(e));
