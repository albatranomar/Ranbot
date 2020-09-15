import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("aliases-add", {
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
              m.translate("commands.settings.aliases.add.prompts.newalias.start"),
            retry: (m: Message) =>
              m.translate("commands.settings.aliases.add.prompts.newalias.retry"),
          },
        },
        {
          id: "forcommand",
          type: "commandAlias",
          prompt: {
            start: (m: Message) =>
              m.translate("commands.settings.aliases.add.prompts.forcommand.start"),
            retry: (m: Message) =>
              m.translate("commands.settings.aliases.add.prompts.forcommand.retry"),
          },
        }
      ],
    });
  }

  async exec(message: Message, { alias, forcommand }: { alias: string, forcommand: Command }) {
    if (message.prefix.length >= 5)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            message.translate("commands.settings.aliases.add.error")
          )
      );

    alias.replace(/`/g, "");
    await this.client.database.createGuildAlias(message.guild, forcommand.id, alias);

    return message.util.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          message.translate("commands.settings.aliases.add.success", { alias })
        )
    );
  }
}
