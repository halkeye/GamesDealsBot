const moment = require('moment');
const { Command } = require('discord.js-commando');
const logger = require('../../lib/logger.js');
const Deal = require('../../models/Deal.js');

module.exports = class LastDealCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lastdeal',
      aliases: ['ld'],
      group: 'util',
      memberName: 'lastdeal',
      description: 'Sends information about last found game.',
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  timestamp(createdAt) {
    const date = new Date(createdAt);
    return moment(date).format('YYYY-MM-DD');
  }

  async run(msg) {
    try {
      const lastDeal = await Deal.getLastDeal();
      const message = `**:calendar: Date:** ${this.timestamp(lastDeal.createdAt)}\n`
        + `**:video_game: Title:** ${lastDeal.title}\n`
        + `**:mouse_three_button: URL:** ${lastDeal.url}`;
      return msg.reply(`\n${message}`);
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
