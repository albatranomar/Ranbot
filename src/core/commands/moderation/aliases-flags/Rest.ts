import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("aliases-add", {
      category: "flag",
    });
  }

  async exec(message: Message) {
    if (message.prefix.length >= 5)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            message.translate("commands.settings.aliases.rest.error")
          )
      );
    await this.client.database.guildAliasesManagement.deleteAllGuildAliases(message.guild);

    return message.util.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          message.translate("commands.settings.aliases.rest.success")
        )
    );
  } 
}
