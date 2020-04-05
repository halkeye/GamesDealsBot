/* eslint-env jest */
/* global buildSuccessWebhookReply, buildTextChannelCommand */
const Webhook = require('../../../models/Webhook.js');
const Command = require('../../../commands/set-up/clearwebhook.js');

describe('commands - util - broadcast', () => {
  it('Error if no webhook', async () => {
    expect(await Webhook.count()).toEqual(0);
    const { message, command } = buildTextChannelCommand(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([':x: | There are no webhooks related to this server.']);
    expect(await Webhook.count()).toEqual(0);
  });
  it('Successfully remove when webhook exists', async () => {
    buildSuccessWebhookReply();
    const { message, command } = buildTextChannelCommand(Command);

    const webhook = await new Webhook({ webhook_id: '696062142960369765', webhook_token: 'notarealtoken', guild_id: global.DEFAULT_GUILD_ID }).save();
    global.discordJsonNock()
      .get(`/api/v7/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`)
      .reply(200, {
        type: 1,
        id: webhook.webhook_id,
        name: 'Games Deals',
        avatar: '2dea5487942feb81ba405d40389a6b1e',
        channel_id: global.DEFAULT_CHANNEL_ID,
        guild_id: global.DEFAULT_GUILD_ID,
        token: webhook.webhook_token,
        user: {
          id: '695558278398083072',
          username: 'GameDealsBot',
          avatar: 'b44949d0e73544ac7ad2a588ed231ec7',
          discriminator: '3744',
          bot: true,
        },
      });
    global.discordJsonNock()
      .delete(`/api/v7/webhooks/${webhook.webhook_id}/${webhook.webhook_token}`)
      .reply(204, {});

    expect(await Webhook.count()).toEqual(1);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([":white_check_mark: | Webhook has been removed. Bot won't send any notifications to this channel anymore."]);
    expect(await Webhook.count()).toEqual(0);
  });
});
