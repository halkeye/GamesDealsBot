/* eslint-env jest */
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.CLIENT_ID = 'fakeclientid';

const fs = require('fs');
const nock = require('nock');
const MockDate = require('mockdate');
const { CommandoClient, CommandoMessage } = require('discord.js-commando');
const { Snowflake, TextChannel, Constants: { ChannelTypes } } = require('discord.js');
const db = require('./lib/db');
const models = require('./models');

global.DEFAULT_GUILD_ID = '110893872388825088';
global.DEFAULT_CHANNEL_ID = '695353503081693214';

if (process.env.JEST_NOCK_RECORD === 'true') {
  const appendLogToFile = (content) => {
    fs.appendFile('nock.txt', content);
  };
  nock.recorder.rec({
    logging: appendLogToFile,
  });
} else {
  process.env.BOT_TOKEN = 'faketoken';
}

global.discordJsonNock = () => nock('https://discord.com:443', { encodedQueryParams: true }).defaultReplyHeaders({
  'Content-Type': 'application/json',
});
beforeEach(async () => {
  nock.cleanAll();
  nock.disableNetConnect();

  MockDate.set(1585952859 * 1000);
  await db.sync();
  for (const model of Object.values(models)) {
    await model.sync();
    await model.destroy({ where: {}, truncate: true });
  }
});
// afterAll(() => db.close());

global.buildSuccessWebhookReply = () => {
  global.discordJsonNock().post('/api/v7/channels/695353503081693214/webhooks', { name: 'Games Deals', avatar: /data:image\/png;base64,.*/ })
    .reply(200, {
      type: 1,
      id: '696062142960369765',
      name: 'Games Deals',
      avatar: '2dea5487942feb81ba405d40389a6b1e',
      channel_id: global.DEFAULT_CHANNEL_ID,
      guild_id: global.DEFAULT_GUILD_ID,
      token: 'snip token',
      user: {
        id: '695558278398083072',
        username: 'GameDealsBot',
        avatar: 'b44949d0e73544ac7ad2a588ed231ec7',
        discriminator: '3744',
        bot: true,
      },
    });
};

global.buildTextChannelCommand = (_Command) => {
  const bot = new CommandoClient({});
  bot.token = process.env.BOT_TOKEN;
  bot.registry.registerDefaultTypes().registerDefaultGroups();
  const command = new _Command(bot);
  const message = new CommandoMessage(
    bot,
    {
      id: Snowflake.generate(),
    },
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
};
