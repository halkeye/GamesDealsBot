const { Command } = require('discord.js-commando');
const logger = require('../../lib/logger.js');
const Webhook = require('../../models/Webhook.js');

module.exports = class SetMentionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmention',
      aliases: ['sm'],
      group: 'set-up',
      memberName: 'setmention',
      description: 'Set role to mention when new game is found.',
      guildOnly: true,
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
      }],

    });
  }

  async run(msg, args) { // eslint-disable-line class-methods-use-this
    try {
      const webhook = await Webhook.findOne({
        where: {
          guild_id: msg.guild.id,
        },
      });

      if (webhook) {
        webhook.role_to_mention = Object.is(args.roleToMention.name, '@everyone') ? '@everyone' : `<@&${args.roleToMention.id}>`;
        await webhook.save();
        return msg.reply(':white_check_mark: | Role to mention has been set / updated successfully!');
      }

      return msg.reply(':x: | Webhook for this server doesn\'t exists!');
    } catch (e) {
      logger.error(e);
      return msg.reply(':exclamation: | Oh no, something went wrong. Please try again later.');
    }
  }
};
