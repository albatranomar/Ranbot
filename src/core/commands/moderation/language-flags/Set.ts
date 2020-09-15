import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class LanguageCommand extends Command {
  public constructor() {
    super("language-set", {
      category: "flag",
      args: [
        {
          id: "language",
          prompt: {
            start: (m: Message) =>
              m.translate("commands.settings.language.set.prompts.start"),
          },
        },
      ],
    });
  }

  async exec(message: Message, { language }: { language: string }) {
    const langs = [...this.client.languages.languages.keys()];
    if (!langs.includes(language))
      return message.util.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            message.translate("commands.settings.language.set.error")
          )
      );

    await this.client.database.updateGuild(message.guild, 'lang', language);

    return message.util.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          message.translate("commands.settings.language.set.success", {
            language,
          })
        )
    );
  }
}
