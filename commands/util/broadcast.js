const { Command } = require('discord.js-commando');
const Webhook = require('../../models/Webhook.js');
const logger = require('../../lib/logger.js');

module.exports = class BroadcastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'broadcast',
      group: 'util',
      memberName: 'broadcast',
      description: 'Executes ALL webhooks with given message',
      ownerOnly: true,
      hidden: true,
      args: [{
        key: 'message',
        prompt: 'Provide message to be send',
        error: 'Argument must be a string.',
        type: 'string',
      }],
    });
  }

  async run(msg, args) {
    try {
      await Webhook.postMessage(args.message);
      return msg.reply('ACCEPTED!');
    } catch (e) {
      logger.error(e);
      return msg.reply('Something went wrong!');
    }
  }
};
