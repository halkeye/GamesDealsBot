require('dotenv').config();
const { ShardingManager } = require('discord.js');
const util = require('util');
const logger = require('./lib/logger.js');
const db = require('./lib/db.js');

db.authenticate().then(() => {
  require('./models/Deal.js').sync(); // eslint-disable-line global-require
  require('./models/Webhook.js').sync(); // eslint-disable-line global-require
});

const manager = new ShardingManager('./bot.js', { token: process.env.BOT_TOKEN });

manager.spawn();

manager.on('launch', (shard) => logger.info(`Launched shard ${shard.id}`));
manager.on('message', (shard, message) => logger.debug(`Shard[${shard.id}] : ${util.inspect(message)}`));
