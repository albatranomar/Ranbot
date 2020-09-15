import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { BestBotClientOptions, LanguageProvider, Database } from ".";
import Logger from "@ayanaware/logger";
import { join } from "path";

export class BestBotClient extends AkairoClient {
  public logger: Logger = Logger.get(BestBotClient);
  public languages = new LanguageProvider(this, join("languages"));
  public database = new Database();
  
  public constructor(public configuration: BestBotClientOptions) {
    super({
      ownerID: configuration.owners,
      disableMentions: "everyone",
      messageCacheMaxSize: 50,
      messageCacheLifetime: 60,
      messageSweepInterval: 100,
      ws: {
        intents: [
          "GUILDS",
          "GUILD_MESSAGES",
          "GUILD_VOICE_STATES",
          "GUILD_MESSAGE_REACTIONS",
        ],
      },
      
    }, { partials: ['REACTION'] });
  }

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(this.configuration.builtDirectory, "core", "commands"),
    allowMention: true,
    prefix: (message: Message) => {
      if (message.guild) {
        return message.prefix
      }
      return [...config.get("bot.prefix") as string[]];
    },
    blockBots: true,
    blockClient: true,
    commandUtil: true,
    handleEdits: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (msg, text) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              msg.translate("bot.prompts.start", { prompt: text })
            ),
        modifyRetry: (msg, text) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              msg.translate("bot.prompts.start", { prompt: text })
            ),
        cancel: (msg: Message) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(msg.translate("bot.prompts.cancel")),
        timeout: (msg: Message) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(msg.translate("bot.prompts.timeout")),
        ended: (msg: Message) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(msg.translate("bot.prompts.ended")),
        time: 3e4,
        retries: 2,
      },
      otherwise: "",
    },
    aliasReplacement: /-/g,
    automateCategories: true,
    ignoreCooldown: this.ownerID,
    ignorePermissions: this.ownerID,
    defaultCooldown: 15e3
  });

  public eventHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(this.configuration.builtDirectory, "core", "events"),
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: join(this.configuration.builtDirectory, "core", "inhibitors"),
  });

  public async start(): Promise<string> {
    this.commandHandler.useListenerHandler(this.eventHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.eventHandler.setEmitters({
      commandHandler: this.commandHandler,
      websocket: this.ws,
      process,
    });

    await this.database.init();

    await Promise.all([
      this.commandHandler,
      this.eventHandler,
      this.inhibitorHandler,
      this.languages,
    ].map((x) => x.loadAll()));
    
    return super.login(this.configuration.token);
  }
}
