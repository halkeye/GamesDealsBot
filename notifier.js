/* eslint-disable no-await-in-loop */
const axios = require('axios');
const db = require('./lib/db.js');
const logger = require('./lib/logger.js');
const isFree = require('./lib/isFree.js');
const Deal = require('./models/Deal');
const Webhook = require('./models/Webhook');

async function main() {
  await db.authenticate().then(() => {
    require('./models/Deal.js').sync(); // eslint-disable-line global-require
    require('./models/Webhook.js').sync(); // eslint-disable-line global-require
    return require('./models/Deal.js').destroy({ truncate: true });
  });

  const response = await axios.get('https://www.reddit.com/r/GameDeals/hot/.json?limit=3');
  if (response.status === 200) {
    const threads = response.data.data.children;
    const dealsToBroadcast = [];
    for (const thread of threads) { // eslint-disable-line no-restricted-syntax
      const { data: { id, url, title } } = thread;
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
        });
        await deal.save();
        dealsToBroadcast.push(deal);
      }
    }

    logger.debug(dealsToBroadcast);
    if (dealsToBroadcast.length > 0) {
      let message = '';
      dealsToBroadcast.forEach((deal) => {
        message += `${deal.title} ${deal.url}\n`;
      });
      try {
        await Webhook.postMessage(message);
        logger.info('ACCEPTED');
      } catch (e) {
        logger.warn(`Something went wrong during webhooks execution. Response status ${e.stack}`);
      }
    }
  }
}

main().then(() => db.close()).catch(e => logger.error(e));
