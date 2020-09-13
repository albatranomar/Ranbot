## Features

### BestBot is using these below for DISCORD API Stuff:
  - [discord.js](https://github.com/discordjs/discord.js)
    - `npm install discord.js`
  - [discord-akairo](https://github.com/discord-akairo/discord-akairo)
    - `npm install discord-akairo`

### And using these below for Database Managements.
  - [PostgreSQL](https://www.postgresql.org/)
  - [Prisma](https://www.prisma.io/)


## Installation and setups.

** Requires Node v12^, Discord.js v12^, PostgreSQL v12^ and Typescript v4^. **

*Clone this repository*  
`git clone https://github.com/albatranomar/best-bot.git`

*Install dependencies*  
`npm install` && `npm install`

*Fill [config.yml]() file with bot informaion (importants)*  
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

*Fill [.env]() file with bot informaion (importants) for Database Managements by [Prisma](https://www.prisma.io/)*  
```env
DATABASE_URL="postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
```

## Links

- [Website](https://discord-akairo.github.io)
- [Repository](https://github.com/discord-akairo/discord-akairo)  
- [Changelog](https://github.com/discord-akairo/discord-akairo/releases)
- [Discord](https://discord.gg/arTauDY)  