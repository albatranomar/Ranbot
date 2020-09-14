import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix-add", {
      category: "flag",
      args: [
        {
          id: "prefix",
          match: "content",
          type: (msg, str) => {
            if (!str) return null;

            str.toLowerCase();

            if (str.length > 12 || str.length < 1 || str.includes(',')) return null;

            return msg.prefix.includes(str.toLowerCase()) ? null : str;
          },
          prompt: {
            start: (m: Message) =>
              m.translate("commands.settings.prefix.add.prompts.start"),
            retry: (m: Message) =>
              m.translate("commands.settings.prefix.add.prompts.retry"),
          },
        },
      ],
    });
  }

  async exec(message: Message, { prefix }: { prefix: string }) {
    if (message.prefix.length >= 5)
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            message.translate("commands.settings.prefix.add.error")
          )
      );

    prefix.replace(/`/g, "");

    message.prefix.push(prefix);
    await this.client.database.guildManagement.updateGuild(message.guild, 'prefix', message.prefix, true);

    return message.util.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          message.translate("commands.settings.prefix.add.success", { prefix })
        )
    );
  }
}
