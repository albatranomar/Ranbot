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
    
  }
}
