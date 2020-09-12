/* eslint-env jest */
const { CommandoClient } = require('discord.js-commando');
const Command = require('../../../commands/util/invite.js');

describe('commands - util - invite', () => {
  it('shares invite link', async () => {
    const command = new Command(new CommandoClient({}));
    const reply = jest.fn();
    await command.run({ reply });
    expect(reply.mock.calls[0]).toEqual(['https://discord.com/oauth2/authorize?client_id=fakeclientid&scope=bot&permissions=536890368']);
  });
});
