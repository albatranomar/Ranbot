import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { operatingSystem } from "../../../library/functions";

export default class StatsCommand extends Command {
  public constructor() {
    super("stats", {
      aliases: ["stats", "botinfo"],
      description: (m: Message) =>
        m.translate("commands.info.stats.description"),
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message: Message) {
    const stats: any = message.translate("commands.info.stats.embed");

    return message.util.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          message.translate("commands.info.stats.embed.author", {
            bot: this.client.user.username,
          }),
          this.client.user.displayAvatarURL()
        )
        .addField(
          stats.fields.generalInfo.name,
          message.translate("commands.info.stats.embed.fields.generalInfo.text", {
            guilds: this.client.guilds.cache.size,
            users: Intl.NumberFormat().format(this.client.users.cache.size),
            emojis: this.client.emojis.cache.size,
            shards: this.client.shard ? this.client.shard.count : 1,
            botstatus: this.client.user.presence.status,
            botgame: this.client.user.presence?.activities[0]?.name ?? null
          }),
          true
        )
        .addField(
          stats.fields.advancedInfo.name,
          message.translate("commands.info.stats.embed.fields.advancedInfo.text", {
            os: operatingSystem(),
            cpuusage: (process.cpuUsage().user / 1024 / 1024).toFixed(2),
            memusage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            nodejs: process.version,
            npm: require("child_process")
              .execSync("npm -v")
              .toString()
              .replace("\n", ""),
            discordjs: require("discord.js").version,
          }),
          true
        )
    );
  }
}
