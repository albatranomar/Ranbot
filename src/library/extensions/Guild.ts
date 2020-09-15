import { Structures } from "discord.js";
import { AkairoClient } from "discord-akairo";

export default Structures.extend(
  "Guild",
  (Guild) =>
    class BestBotGuild extends Guild {
      public get language() {
        return (this.client as AkairoClient).database.guilds.get(this.id)?.lang ?? config.get("bot.defaultLang") as string
      }

      public get databaseMembers() {
        return (this.client as AkairoClient).database.guilds.get(this.id)?.members ?? [];
      }

      public get databaseAliases() {
        return (this.client as AkairoClient).database.guilds.get(this.id)?.aliases ?? [];
      }
    }
);