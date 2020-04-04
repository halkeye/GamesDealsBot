/* eslint-env jest */
/* global buildSuccessWebhookReply, buildTextChannelCommand */
const Webhook = require('../../../models/Webhook.js');
const Command = require('../../../commands/set-up/sendhere.js');

describe('commands - util - broadcast', () => {
  it('Create webhook if not exists', async () => {
    await new Webhook({ webhook_id: 'notarealid', webhook_token: 'notarealtoken', guild_id: 'oldguild' }).save();
    buildSuccessWebhookReply();
    const { message, command } = buildTextChannelCommand(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([':white_check_mark: | Channel has been set successfully!']);
    expect(await Webhook.findOne({ where: { webhook_id: 'notarealid' } })).not.toBeNull();
    expect(await Webhook.findOne({ where: { webhook_id: '696062142960369765' } })).not.toBeNull();
    expect(await Webhook.count()).toEqual(2);
  });
  it('Error when webhook already exists', async () => {
    await new Webhook({ webhook_id: '696062142960369765', webhook_token: 'notarealtoken', guild_id: global.DEFAULT_GUILD_ID }).save();
    buildSuccessWebhookReply();
    const { message, command } = buildTextChannelCommand(Command);
    await command.run(message, { roleToMention: '' });
    expect(message.reply.mock.calls[0]).toEqual([':x: | Webhook for this server already exists!']);
    expect(await Webhook.count()).toEqual(1);
  });
});
