import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class RollCommand extends Command {
  public constructor() {
    super("roll", {
      aliases: ["roll", "pick", 'random'],
      description: (m: Message) =>
        m.translate("commands.general.roll.description"),
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message: Message) {
    
  }
}
