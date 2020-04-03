const moment = require('moment');
const { Command } = require('discord.js-commando');
const Webhook = require('../../models/Webhook.js');
const Deal = require('../../models/Deal.js');
const logger = require('../../lib/logger.js');

module.exports = class StatisticsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'statistics',
      aliases: ['stats', 'stat'],
      group: 'util',
      memberName: 'statistics',
      description: 'Sends basic statistics about the bot.',
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const webhooksCount = await Webhook.count({ paranoid: true });
      const dealsCount = await Deal.count({ paranoid: false });
      const guilds = await this.client.shard.fetchClientValues('guilds.size');
      const guildsCount = guilds.reduce((acc, cur) => acc + cur);
      const stats = `:robot: **Uptime:** ${moment.duration(this.client.uptime).locale('en').humanize()}\n`
        + `:desktop: **Servers:** ${guildsCount}\n`
        + `:postbox: **Webhooks:** ${webhooksCount}\n`
        + `:video_game: **Found Games:** ${dealsCount}`;
      return msg.reply(`\n${stats}`);
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
