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
    await new Webhook({ webhook_id: '696062142960369765', webhook_token: 'notarealtoken', guild_id: global.DEFAULT_GUILD_ID }).save();
    expect(await Webhook.count()).toEqual(1);
    buildSuccessWebhookReply();
    const { message, command } = buildTextChannelCommand(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([":white_check_mark: | Webhook has been removed. Bot won't send any notifications to this channel anymore."]);
    expect(await Webhook.count()).toEqual(0);
  });
});
