import Logger from "@ayanaware/logger";
export * from "./classes";
export * from "./bestbotClient";

import { PermissionString } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Configuration } from ".";
import { LanguageProvider } from ".";
import { Database } from "./classes";

export interface BestBotClientOptions {
  owners: string | string[];
  token: string;
  builtDirectory: string;
}

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    eventHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    logger: Logger;
    languages: LanguageProvider;
    database: Database
  }
}

declare global {
  const prisma: PrismaClient;
  const config: Configuration;
}

declare module "discord.js" {
  interface Message {
    translate<T extends any>(path: string, variables?: Record<string, any>): T;
    language: string;
    prefix: string[];
  }

  interface GuildMember {
    checkPermissions(permissions?: PermissionString | PermissionString[]);
  }
}