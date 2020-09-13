## Features

- [x] Languages system
  - _Commands_
    - `language`
    - `language set en-US`
    - `language delete`
    - `language langs`
- [x] Prefixes system
  - _Commands_
    - `prefix`
    - `prefix add !`
    - `prefix delete !`
- [x] Features Supported by [discord-akairo](https://github.com/discord-akairo/discord-akairo).
  - #### Completely modular commands, inhibitors, and listeners.
    - Reading files recursively from directories.
    - Adding, removing, and reloading modules.
    - Creating your own handlers and module types.

  - #### Flexible command handling and creation.
    - Command aliases.
    - Command throttling and cooldowns.
    - Client and user permission checks.
    - Running commands on edits and editing previous responses.
    - Multiple prefixes and mention prefixes.
    - Regular expression and conditional triggers.

  - #### Complex and highly customizable arguments.
    - Support for quoted arguments.
    - Arguments based on previous arguments.
    - Several ways to match arguments, such as flag arguments.
    - Casting input into certain types.
      - Simple types such as string, integer, float, url, date, etc.
      - Discord-related types such as user, member, message, etc.
      - Types that you can add yourself.
      - Asynchronous type casting.
    - Prompting for input for arguments.
      - Customizable prompts with embeds, files, etc.
      - Easily include dynamic data such as the incorrect input.
      - Infinite argument prompting.

  - #### Blocking and monitoring messages with inhibitors.
    - Run at various stages of command handling.
      - On all messages.
      - On messages that are from valid users.
      - On messages before commands.

  - #### Helpful events and modular listeners.
    - Events for handlers, such as loading modules.
    - Events for various stages of command handling.
    - Reloadable listeners to easily separate your event handling.

### BestBot is using these below for DISCORD API Stuff:

- [discord.js](https://github.com/discordjs/discord.js)
  - `npm install discord.js`
- [discord-akairo](https://github.com/discord-akairo/discord-akairo)
  - `npm install discord-akairo`

### And using these below for Database Managements.

- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)

## Requiremens, Installation, Configirations, and Setups.

### Requiremens

- [x] Requires Node `v12^`.
- [x] Discord.js `v12^`.
- [x] PostgreSQL `v12^`.
- [x] Typescript `v4^`.

### Installation

_Clone this repository_  
`git clone https://github.com/albatranomar/best-bot.git`

_Install dependencies_  
`npm install` && `npm install`

### Configirations

_Fill [config.yml](https://github.com/albatranomar/best-bot/blob/master/config.yml.sample) with bot informaion (importants)_

```yml
bot:
  prefix: ["!"]
  defaultLang: "en-US"
  owners: ["349124522747887616"]
  links:
    discord: https://discord.gg/sample
    invite: https://discord.com/oauth2/authorize?client_id={{client_id}}&scope=bot&permissions=8
  tokens:
    discord: "CLIENT TOKEN"
  channels:
    guilds: "698204562246336657"
    errors: "698204562246336657"
```

_Fill [.env](https://github.com/albatranomar/best-bot/blob/master/prisma/.env.sample) with bot informaion (importants) for Database Managements by [Prisma](https://www.prisma.io/)_

```env
DATABASE_URL="postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
```

### Setups

- In your PostgreSQL Database create tables by using [tables.schema.sql]()
- Then after createing tables:
  - _Type in gitbash_: `npm run db:match`
    - _Or use_ `npx prisma introspect && npx prisma generate`
- Well done. lets go to run and start a bot.

## Run & Start the bot.

- _To run test bot use:_ `npm run test`
- _To run bot in development mode_ `npm run start:dev`
- _To run bot in production mode using [Pm2](https://github.com/Unitech/pm2)_ `npm run start:pro`
- _To restart bot using [Pm2](https://github.com/Unitech/pm2)_ `npm run restart`

## Links

- [Website](https://github.com/albatranomar/best-bot)
- [Repository](https://github.com/albatranomar/best-bot)
- [Changelog](https://github.com/albatranomar/best-bot/releases)
- [Discord](https://discord.gg/OMARTHEBEST)
