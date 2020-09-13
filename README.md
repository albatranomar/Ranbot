## Features

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

*Clone this repository*  
`git clone https://github.com/albatranomar/best-bot.git`

*Install dependencies*  
`npm install` && `npm install`

### Configirations

*Fill [config.yml](https://github.com/albatranomar/best-bot/blob/master/config.yml.sample) with bot informaion (importants)*  
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

*Fill [.env](https://github.com/albatranomar/best-bot/blob/master/prisma/.env.sample) with bot informaion (importants) for Database Managements by [Prisma](https://www.prisma.io/)*  
```env
DATABASE_URL="postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
```

### Setups
  - In your PostgreSQL Database create tables by using [tables.schema.sql]()
  - Then after createing tables:
    - *Type in gitbash*: `npm run db:match`
      - *Or use* `npx prisma introspect && npx prisma generate`
  - Well done. lets go to run and start a bot.

## Run & Start the bot.
  - *To run test bot use:* `npm run test`
  - *To run bot in development mode* `npm run start:dev`
  - *To run bot in production mode using [Pm2](https://github.com/Unitech/pm2)* `npm run start:pro`
  - *To restart bot using [Pm2](https://github.com/Unitech/pm2)* `npm run restart`


## Links

- [Website](https://github.com/albatranomar/best-bot)
- [Repository](https://github.com/albatranomar/best-bot)  
- [Changelog](https://github.com/albatranomar/best-bot/releases)
- [Discord](https://discord.gg/OMARTHEBEST)  