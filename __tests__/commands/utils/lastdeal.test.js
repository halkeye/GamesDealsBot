/* eslint-env jest */
const { CommandoClient } = require('discord.js-commando');
const Deal = require('../../../models/Deal.js');
const LastDeal = require('../../../commands/util/lastdeal.js');

describe('commands - util - lastdeal', () => {
  it('returns the last deal found', async () => {
    await new Deal({ title: 'foo', url: 'bar', thread_id: 'foobar' }).save();

    const command = new LastDeal(new CommandoClient({}));
    const reply = jest.fn();
    await command.run({
      id: 'something',
      reply,
    });
    expect(reply.mock.calls[0]).toEqual(['\n**:calendar: Date:** 2020-04-03\n**:video_game: Title:** foo\n**:mouse_three_button: URL:** bar']);
  });
});
