const Sequelize = require('sequelize');
const asyncPool = require('tiny-async-pool');
const axios = require('axios');
const database = require('../lib/db.js');
const logger = require('../lib/logger.js');

const Webhook = database.define(
  'webhooks',
  {
    webhook_id: {
      type: Sequelize.TEXT,
      required: true,
      unique: true,
    },
    webhook_token: {
      type: Sequelize.TEXT,
      required: true,
    },
    guild_id: {
      type: Sequelize.TEXT,
      required: true,
      unique: true,
    },
    role_to_mention: {
      type: Sequelize.TEXT,
      required: false,
    },
  },
  { timestamps: true },
);

Webhook.postMessage = async (message) => {
  const webhooks = await Webhook.findAll({});
  if (!webhooks.length) {
    return;
  }


  const postWebhook = async (webhook) => {
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

  const responses = await asyncPool(30, webhooks, postWebhook);

  const webhooksToRemove = [];
  let rateLimitedWebhooks = 0;
  let failedWebhooks = 0;
  responses.forEach((response) => {
    const { statusCode } = response.request.res;
    if (statusCode === 404 || statusCode === 401) {
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
