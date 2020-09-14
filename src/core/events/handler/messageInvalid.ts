import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class messageInvalidListener extends Listener {
  public constructor() {
    super("messageInvalid", {
      emitter: "commandHandler",
      event: "messageInvalid",
    });
  }

  public async exec(message: Message) {
    // Handle the commands that is has costume aliase from database.
    for (const Aliase of message.guild.databaseAliases) {
      let it = Aliase.aliases.find(a => message.content.includes(a));
      if (it) {
        message.content = message.content.replace(it, Aliase.commandID);
        this.client.commandHandler.handle(message);
        break;
      }
    }
  }
}
