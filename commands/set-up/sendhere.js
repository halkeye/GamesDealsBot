const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const Webhook = require('../../models/Webhook.js');
const logger = require('../../lib/logger.js');

module.exports = class SendHereCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sendhere',
      aliases: ['sh'],
      group: 'set-up',
      memberName: 'sendhere',
      description: 'Set a channel for the bot.',
      details: 'Bot will send notifications about free games in the channel this command was issued.',
      guildOnly: true,
      clientPermissions: ['MANAGE_WEBHOOKS'],
      userPermissions: ['MANAGE_WEBHOOKS'],
      throttling: {
        usages: 2,
        duration: 60,
      },
      args: [{
        key: 'roleToMention',
        prompt: 'Please specify what role should be mentioned',
        error: 'Argument must be a role.',
        type: 'role',
        default: {},
      }],
    });
  }

  async run(msg, args) { // eslint-disable-line class-methods-use-this
    try {
      const webhook = await Webhook.findForGuild(msg.guild.id);

      if (!webhook) {
        const image = fs.readFileSync(path.resolve(__dirname, '..', '..', 'assets', 'avatar.png'), 'base64');
        const discordWebhook = await msg.channel.createWebhook('Games Deals', { avatar: `data:image/png;base64,${image}` });
        await new Webhook({
          webhook_id: discordWebhook.id,
          webhook_token: discordWebhook.token,
          guild_id: discordWebhook.guildID,
          role_to_mention: Object.prototype.hasOwnProperty.call(args.roleToMention, 'name') ? `@${args.roleToMention.name}` : undefined,
        }).save();
        return msg.reply(':white_check_mark: | Channel has been set successfully!');
      }
      return msg.reply(':x: | Webhook for this server already exists!');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
