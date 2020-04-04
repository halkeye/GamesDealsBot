# GamesDeals Bot

![GitHub](https://img.shields.io/github/license/mikolajkalwa/GamesDealsBot.svg)
![Discord](https://img.shields.io/discord/455351349660614666.svg)
[![Discord Bots](https://discordbots.org/api/widget/status/396466836331429889.svg?noavatar=true)](https://discordbots.org/bot/396466836331429889)
[![Discord Bots](https://discordbots.org/api/widget/servers/396466836331429889.svg?noavatar=true)](https://discordbots.org/bot/396466836331429889)

## Description

GamesDeals is Discord bot build with discord.js. GamesDeals informs about games which price was reduced to 0. It uses https://www.reddit.com/r/GameDeals as a source.

## Command list 

|                 | Command       | Aliases     | Description                                                                                                      | Required permissions |
| --------------- | ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- | -------------------- |
| Set-up commands |               |             |                                                                                                                  |                      |
|                 | sendhere      | sh          | Bot will send notifications about free games in the channel this command was issued.                             | Manage Webhooks      |
|                 | forgetserver  | fs          | Makes bot forget the server. Removes related webhook. Bot won't send any notifications about free games anymore. | Manage Webhooks      |
|                 | setmention    | sm          | Set (update) role to mention when new game is found.                                                             | Manage Webhooks      |
|                 | removemention | rm          | Makes bot stop mentioning a role when a new game is found.                                                       | Manage Webhooks      |
| Utility         |               |             |                                                                                                                  |                      |
|                 | invite        | inv         | Sends bot invitation URL.                                                                                        |                      |
|                 | lastdeal      | ld          | Sends information about last found game.                                                                         |                      |
|                 | statistics    | stat, stats | Sends basic statistics about the bot.                                                                            |                      |

Command list can be accessed via `help` command.

## How to run own instance of the bot

1. Clone this repo,
2. Run `npm install`.
3. Configure the required environment variables (`.env` file can be used).
4. Run `npm run start-pretty`.

### Required environment variables

1. `BOT_TOKEN` generated on https://discordapp.com/developers/applications
2. `DATABASE_URL` - 

### Optional environment variables

* `COMMAND_PREXIF` - Command prefix, defaults to `gd:`
* `LOG_LEVEL` - Which log level to use, defaults to `info`
* `LOG_FILE` - What log file to log to, defaults to only console log
* `DISCORD_BOTS_ORG` - report to discordbots.org
* `DISCORD_BOTS_GG` - report to discord.bots.gg
* `ADMIN_USER_ID` - Bot admin discord id. Allowed to run sensitive commands like broadcast

## Licence 

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.
