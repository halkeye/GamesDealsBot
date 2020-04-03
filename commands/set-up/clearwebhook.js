const { Command } = require('discord.js-commando');
const logger = require('../../lib/logger.js');
const Webhook = require('../../models/Webhook.js');

module.exports = class ClearWebhookCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwebhook',
      aliases: ['fs', 'forgetserver', 'cw'],
      group: 'set-up',
      memberName: 'clearwebhook',
      description: 'Removes webhook related with the bot.',
      guildOnly: true,
      clientPermissions: ['MANAGE_WEBHOOKS'],
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const count = await Webhook.destroy({
        where: {
          guild_id: msg.guild.id,
        },
        paranoid: true,
      });
      if (!count) {
        return msg.reply(':x: | There are no webhooks related to this server.');
      }
      return msg.reply(':white_check_mark: | Webhook has been removed. Bot won\'t send any notifications to this channel anymore.');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
