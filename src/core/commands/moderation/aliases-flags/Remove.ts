import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { confirm } from "../../../../library/functions";

export default class PrefixCommand extends Command {
  public constructor() {
    super("aliases-del", {
      category: "flag",
      args: [
        {
          id: "alias",
          type: (msg, str) => {
            if (!str) return null;
            str = str.toLowerCase().split(' ').join('');
            
            if (str.length > 15 || str.length < 1) return null;
            return msg.guild.databaseAliases.find((a) => a.aliases.includes(str)) ? null : str;
          },
          prompt: {
            start: (m: Message) =>
              m.translate("commands.settings.aliases.delete.prompts.alias.start"),
            retry: (m: Message) =>
              m.translate("commands.settings.aliases.delete.prompts.alias.retry"),
          },
        },
        {
          id: "forcommand",
          type: "commandAlias",
          prompt: {
            start: (m: Message) =>
              m.translate("commands.settings.aliases.delete.prompts.forcommand.start"),
            retry: (m: Message) =>
              m.translate("commands.settings.aliases.delete.prompts.forcommand.retry"),
          },
        }
      ],
    });
  }

  async exec(message: Message, { alias, forcommand }: { alias: string, forcommand: Command }) {
    const words = (message.translate("bot.prompts.confirmWords") ?? [
      "yes",
      "no",
    ]) as string[];

    const conf = await confirm(
      message,
      message.translate("commands.settings.aliases.remove.prompts.confirm", {
        words: words.map((word) => `\`${word}\``).join(", "),
      })
    );

    if (!conf)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            message.translate(
              "commands.settings.aliases.remove.prompts.cancelled"
            )
          )
      );

    await this.client.database.guildAliasesManagement.deleteGuildAlias(message.guild, forcommand.id, alias);

    return message.util.send(
      new MessageEmbed().setColor("#7289DA").setDescription(
        message.translate("commands.settings.aliases.remove.success", {
          alias,
        })
      )
    );
  }
}
