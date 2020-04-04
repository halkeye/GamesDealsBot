/* eslint-env jest */
const { CommandoClient } = require('discord.js-commando');
const Deal = require('../../../models/Deal.js');
const Command = require('../../../commands/util/statistics.js');

describe('commands - util - lastdeal', () => {
  it('generates basic statistics', async () => {
    await new Deal({ title: 'foo', url: 'bar', thread_id: 'foobar' }).save();

    const command = new Command(new CommandoClient({}));
    command.getGuildSize = () => 0;
    const reply = jest.fn();
    await command.run({
      id: 'something',
      reply,
    });
    expect(reply.mock.calls[0]).toEqual(['\n:robot: **Uptime:** a few seconds\n:desktop: **Servers:** 0\n:postbox: **Webhooks:** 0\n:video_game: **Found Games:** 1']);
  });
});
