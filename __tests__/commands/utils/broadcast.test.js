/* eslint-env jest */
const { CommandoClient } = require('discord.js-commando');
const Webhook = require('../../../models/Webhook.js');
const Command = require('../../../commands/util/broadcast.js');

describe('commands - util - broadcast', () => {
  it('broadcasts to all webhooks', async () => {
    await new Webhook({ webhook_id: '695831025607114843', webhook_token: 'RibgLvETIJjUIvcq8-Av9KnVpK9K8MZiPijgrNQ84qbp9qB88yKJTSeBrPRQcUGoZEdi', guild_id: '110893872388825088' }).save();
    await new Webhook({ webhook_id: 'notarealid', webhook_token: 'notarealtoken', guild_id: 'notarealguild' }).save();
    global.discordJsonNock()
      .post('/api/webhooks/695831025607114843/RibgLvETIJjUIvcq8-Av9KnVpK9K8MZiPijgrNQ84qbp9qB88yKJTSeBrPRQcUGoZEdi', { content: 'foo' })
      .reply(204, {});
    global.discordJsonNock()
      .post('/api/webhooks/notarealid/notarealtoken', { content: 'foo' })
      .reply(400, { webhook_id: ['Value "notarealid" is not snowflake.'] });

    const bot = new CommandoClient({});
    bot.registry.registerDefaultTypes().registerDefaultGroups();
    const command = new Command(bot);
    const reply = jest.fn();
    await command.run({ reply }, { message: 'foo' });
    expect(reply.mock.calls[0]).toEqual(['ACCEPTED!']);
    expect(await Webhook.findOne({ where: { webhook_id: 'notarealid' } })).toEqual(null);
  });
});
