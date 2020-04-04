/* eslint-env jest */
const { CommandoClient, CommandoMessage } = require('discord.js-commando');
const { TextChannel, Constants: { ChannelTypes } } = require('discord.js');
const nock = require('nock');
const Webhook = require('../../../models/Webhook.js');
const Command = require('../../../commands/set-up/sendhere.js');

function build(_Command) {
  const bot = new CommandoClient({});
  bot.token = process.env.BOT_TOKEN;
  bot.registry.registerDefaultTypes().registerDefaultGroups();
  const command = new _Command(bot);
  const message = new CommandoMessage(
    bot,
    {},
    new TextChannel({
      client: bot,
      id: '110893872388825088',
      member: jest.fn(() => null),
    }, {
      id: '695353503081693214',
      type: ChannelTypes.TEXT,
    }),
  );
  message.reply = jest.fn();
  return { message, command };
}

function buildSuccessWebhookReply() {
  nock('https://discordapp.com:443', { encodedQueryParams: true })
    .post('/api/v7/channels/695353503081693214/webhooks', { name: 'Games Deals', avatar: /data:image\/png;base64,.*/ })
    .reply(200, {
      type: 1,
      id: '696062142960369765',
      name: 'Games Deals',
      avatar: '2dea5487942feb81ba405d40389a6b1e',
      channel_id: '695353503081693214',
      guild_id: '110893872388825088',
      token: 'snip token',
      user: {
        id: '695558278398083072',
        username: 'GameDealsBot',
        avatar: 'b44949d0e73544ac7ad2a588ed231ec7',
        discriminator: '3744',
        bot: true,
      },
    });
}


describe('commands - util - broadcast', () => {
  it('Create webhook if not exists', async () => {
    await new Webhook({ webhook_id: 'notarealid', webhook_token: 'notarealtoken', guild_id: 'oldguild' }).save();
    buildSuccessWebhookReply();
    const { message, command } = build(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([':white_check_mark: | Channel has been set successfully!']);
    expect(await Webhook.findOne({ where: { webhook_id: 'notarealid' } })).not.toBeNull();
    expect(await Webhook.findOne({ where: { webhook_id: '696062142960369765' } })).not.toBeNull();
    expect(await Webhook.count()).toEqual(2);
  });
  it('Error when webhook already exists', async () => {
    await new Webhook({ webhook_id: '696062142960369765', webhook_token: 'notarealtoken', guild_id: '110893872388825088' }).save();
    buildSuccessWebhookReply();
    const { message, command } = build(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([':x: | Webhook for this server already exists!']);
    expect(await Webhook.count()).toEqual(1);
  });
});
