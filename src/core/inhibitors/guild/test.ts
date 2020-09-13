import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class DjRoleInhibitor extends Inhibitor {
  public constructor() {
    super("djrole", {
      reason: "djrole",
    });
  }

  exec(message: Message, cmd: Command): boolean {
    return false;
  }
}