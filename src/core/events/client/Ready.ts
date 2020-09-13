import { Listener } from "discord-akairo";

export default class ReadyEvent extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }

  exec() {
    this.client.logger.info(`${this.client.user.tag} Is Ready To GO!`);
    this.client.logger.info(`Username: ${this.client.user.username}, Tag: ${this.client.user.discriminator}`);
    this.client.logger.info(`Users: ${this.client.users.cache.size}, Servers: ${this.client.guilds.cache.size}`);
    this.client.logger.info(`Categories: ${this.client.commandHandler.categories.size}, Commands: ${this.client.commandHandler.modules.size}`);
    this.client.commandHandler.categories.filter(c => c.id != "flag").map((cat) => {
      this.client.logger.info(`Categories[${cat.id}]: ${this.client.commandHandler.modules.filter((com) => com.categoryID == cat.id).map((com) => com.id).join(',')}.`);
    });
    // this.client.user.setActivity(
    //   `${config.get("bot.prefix")[0]}help | giving people music to listen to`,
    //   { type: "WATCHING" }
    // );
  }
}
