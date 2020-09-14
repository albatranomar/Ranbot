import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("aliases-current", {
      category: "flag",
    });
  }

  exec(message: Message) {
    return message.util.send(
      new MessageEmbed().setColor("#7289DA").setDescription(
        message.translate("commands.settings.aliases.current", {
          aliases: message.guild.databaseAliases
            .map((p, i) => `**${i + 1}.** ${p.commandID} -> \`${p.aliases.join(',')}\` `)
            .join("\n"),
        })
      )
    );
  }
}
 