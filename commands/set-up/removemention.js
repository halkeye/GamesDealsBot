const { Command } = require('discord.js-commando');
const Webhook = require('../../models/Webhook.js');
const logger = require('../../lib/logger.js');

module.exports = class RemoveMentionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removemention',
      aliases: ['rm'],
      group: 'set-up',
      memberName: 'removemention',
      description: 'Makes bot stop mentioning a role when a new game is found.',
      guildOnly: true,
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
    });
  }

  async run(msg) { // eslint-disable-line class-methods-use-this
    try {
      const webhook = await Webhook.findOne({
        where: {
          guild_id: msg.guild.id,
        },
      });

      if (!webhook) {
        return msg.reply(':x: | Webhook for this server doesn\'t exists!');
      }

      webhook.role_to_mention = null;
      await webhook.save();
      return msg.reply(':white_check_mark: | Role to mention has been updated successfully!');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
