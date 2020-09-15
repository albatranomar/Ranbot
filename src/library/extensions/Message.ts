import { Structures } from "discord.js";
import { AkairoClient } from "discord-akairo";

export default Structures.extend(
  "Message",
  (Message) =>
    class BestBotMessage extends Message {
      public get language() {
        if (!this.guild) return config.get("bot.defaultLang") as string;
        return (this.client as AkairoClient).database.guilds.get(this.guild.id)?.lang ?? config.get("bot.defaultLang") as string
      }

      public get prefix(): string[] {
        let prefixes = [...config.get("bot.prefix") as string[]];
        if (!this.guild) return prefixes;
        if (!(this.client as AkairoClient).database.guilds.has(this.guild.id)) return prefixes;
        let dbGuildPrefixes = (this.client as AkairoClient).database.guilds.get(this.guild.id)?.prefix;
        if (dbGuildPrefixes.includes('-')) {
          prefixes = dbGuildPrefixes;
        } else {
          dbGuildPrefixes.forEach(p => prefixes.push(p))
        }
        return prefixes;
      }

      public translate(path: string, variables?: Record<string, any>): any {
        const data = (this.client as AkairoClient).languages.get(
          this.language,
          path,
          variables
        );

        return (
          data || `\`${path}\` has not been initialized for ${this.language}`
        );
      }
    }
);