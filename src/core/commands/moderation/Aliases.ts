import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class AliasesCommand extends Command {
  public constructor() {
    super("aliases", {
      aliases: ["aliases", "triggers"],
      description: (m: Message) =>
        m.translate("commands.settings.aliases.description"),
      channel: "guild",
      userPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
    });
  }

  public *args() {
    const method = yield {
      type: [
        ["aliases-add", "add"],
        ["aliases-del", "del", "delete", "rm", "remove"],
        ["aliases-rest", "rest", "del-all", "delete-all", "rm-all", "remove-all"],
        ["aliases-current", "current"],
      ],
      default: "aliases-current",
    };

    return Flag.continue(method);
  }
}
