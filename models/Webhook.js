const Sequelize = require('sequelize');
const pAll = require('p-all');
const axios = require('axios');
const database = require('../lib/db.js');
const logger = require('../lib/logger.js');

const Webhook = database.define(
  'webhooks',
  {
    webhook_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    webhook_token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    guild_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    role_to_mention: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: true },
);

const postWebhook = async (message, webhook) => {
  let content = message;
  if (webhook.role_to_mention) {
    content = `${webhook.role_to_mention} ${message}`;
  }
  return axios.post(
    `https://discordapp.com/api/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`,
    { content },
    { validateStatus: () => true }, // doesn't reject promise when there is ANY response.
  );
};

Webhook.postMessage = async (message) => {
  const webhooks = await Webhook.findAll({});
  if (!webhooks.length) {
    return;
  }

  const actions = webhooks.map(webhook => () => postWebhook(message, webhook));
  const responses = await pAll(actions, { concurrency: 30 });

  const webhooksToRemove = [];
  let rateLimitedWebhooks = 0;
  let failedWebhooks = 0;
  responses.forEach((response) => {
    const statusCode = response.status;
    if (statusCode === 404 || statusCode === 401 || statusCode === 400) {
      const webhookID = response.config.url.split('/')[5];
      webhooksToRemove.push(webhookID);
    }
    if (statusCode === 429) {
      // TODO: implement some kind of throttling to prevent rate limiting.
      rateLimitedWebhooks += 1;
    }
    if (statusCode >= 500 && statusCode < 600) {
      // TODO: implement retry mechanism
      failedWebhooks += 1;
    }
  });

  // deletes invalid / outdated webhooks from the database
  await Webhook.destroy({
    where: {
      webhook_id: {
        [Sequelize.Op.in]: webhooksToRemove,
      },
    },
  });
  logger.info(`Removed webhooks: ${webhooksToRemove.length}.
    Rate limited webhooks (didn't execute): ${rateLimitedWebhooks}.
    Webhooks which failed to execute: ${failedWebhooks}.`);
};

module.exports = Webhook;
