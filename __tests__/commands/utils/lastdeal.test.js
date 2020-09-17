/* eslint-env jest */
const { CommandoClient } = require('discord.js-commando');
const Deal = require('../../../models/Deal.js');
const LastDeal = require('../../../commands/util/lastdeal.js');

describe('commands - util - lastdeal', () => {
  it('returns the last deal found', async () => {
    await new Deal({
      title: '[Steam] Life is Strange 2 - Episode 1 (Free/100% off)',
      url: 'https://store.steampowered.com/app/532210/Life_is_Strange_2/',
      thread_id: 'iuo66l',
      author: 'pharrt',
    }).save();

    const command = new LastDeal(new CommandoClient({}));
    const reply = jest.fn();
    await command.run({
      id: 'something',
      reply,
    });
    expect(reply.mock.calls[0]).toEqual(['\n**:calendar: Date:** 2020-04-03\n**:question: Original Post:** <https://reddit.com/iuo66l>@pharrt\n**:video_game: Title:** [Steam] Life is Strange 2 - Episode 1 (Free/100% off)\n**:mouse_three_button: URL:** https://store.steampowered.com/app/532210/Life_is_Strange_2/']);
  });
});
