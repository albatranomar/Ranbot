import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class RollCommand extends Command {
  public constructor() {
    super("roll", {
      aliases: ["roll", "pick", 'random', 'rng'],
      args: [
        {
          id: 'limit',
          type: 'number',
          default: 100,
        }
      ],
      description: (m: Message) => m.translate("commands.general.roll.description"),
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message: Message, { limit }: { limit: number }) {
    let random = Math.random() * limit + 1;

    message.util.send(new MessageEmbed().setColor("random").setDescription(message.translate("commands.general.roll.showRollMessage", { random })));
  }
}
