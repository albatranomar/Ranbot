import { Guild, Collection, User } from "discord.js";
import { EventEmitter } from "events";
import { User as dbUser, UserLevel, Guild as dbGuild, GuildMember, GuildAliases } from "@prisma/client";
import dotprop from "dot-prop";
import { gunzipSync } from "zlib";
import { printStack } from "@prisma/client/runtime";
import Logger from "@ayanaware/logger";
import { read } from "fs";

interface defaultUsersCollectionSchema extends dbUser {
  level: UserLevel
};

interface defaultGuildsCollectionSchema extends dbGuild {
  members: GuildMember[],
  aliases: GuildAliases[]
};

const defaultUserSettings = {
  totalxp: 1,
  likes: 0,
  coins: 1,
  bio: 'come back later(OMAR)',
};

const defaultUserLevel = {
  current: 1,
  xp: 1,
  levelup: 500,
};

const defaultGuildSettings = {
  prefix: {
    set: ['-']
  },
  lang: "en-US"
};

export class Database extends EventEmitter {
  public logger: Logger = Logger.get(Database);
  public guilds = new Collection<string, defaultGuildsCollectionSchema>();
  public users = new Collection<string, defaultUsersCollectionSchema>();

  public async init(): Promise<void> {
    this.emit("initialized");
    for (const guild of await prisma.guild.findMany()) {
      guild["members"] = await (await prisma.guildMember.findMany({ where: { guildID: guild.id } }));
      guild["aliases"] = await (await prisma.guildAliases.findMany({ where: { guildID: guild.id } }));
      this.guilds.set(guild.id, guild as defaultGuildsCollectionSchema);
    }
    for (const user of await prisma.user.findMany()) {
      user["level"] = await prisma.userLevel.findOne({ where: { userID: user.id } });
      this.users.set(user.id, user as defaultUsersCollectionSchema);
    }
  }

  public async reCache(): Promise<void> {
    await this.init();
  }

  public async createUser(user: string | User) {
    let userID = Database.userIDResolver(user);
    if (this.users.has(userID)) {
      return this.users.get(userID);
    } else {
      let newUser = await prisma.user.create({
        data: {
          id: userID,
          ...defaultUserSettings,
          UserLevel: {
            create: {
              ...defaultUserLevel
            }
          }
        }
      });
      let newUserLevel = await prisma.userLevel.findOne({ where: { userID } });
      this.users.set(userID, {
        ...newUser,
        level: newUserLevel
      });
      return this.users.get(userID);
    }
  }
  public async updateUser(user: string | User, key: string, value: any) {
    let userID = Database.userIDResolver(user);
    if (this.users.has(userID)) {
      this.users.get(userID)[key] = value;
      let data = {};
      data[key] = value;
      return await prisma.user.update({
        where: {
          id: userID
        },
        data
      });
    } else {
      this.logger.warn(`Can't update User(${userID}) cuz can't find ('userID' = '${userID}') in the database`);
      return false;
    }
  }
  public async deleteUser(user: string | User) {
    let userID = Database.userIDResolver(user);
    if (this.users.has(userID)) {
      this.users.delete(userID);
      return await prisma.user.delete({
        where: {
          id: userID
        }
      })
    } else {
      this.logger.warn(`Can't delete User(${userID}) cuz can't find ('userID' = '${userID}') in the database`);
      return false;
    }
  }
  public async createGuild(guild: string | Guild) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      return this.guilds.get(guildID);
    } else {
      let newGuild = await prisma.guild.create({
        data: {
          id: guildID,
          ...defaultGuildSettings
        }
      });
      this.guilds.set(guildID, {
        ...newGuild,
        members: [],
        aliases: []
      });
      return this.guilds.get(guildID);
    }
  }
  public async updateGuild(guild: string | Guild, key: string, value: any, isItAnArray: boolean = false) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      this.guilds.get(guildID)[key] = value;
      if (isItAnArray) {
        value = {
          set: value
        }
      }
      let data = {};
      data[key] = value;
      return await prisma.guild.update({
        where: {
          id: guildID
        },
        data
      });
    } else {
      this.logger.warn(`Can't update Guild(${guildID}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }
  public async deleteGuild(guild: string | Guild) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      this.guilds.delete(guildID);
      return await prisma.guild.delete({
        where: {
          id: guildID
        }
      })
    } else {
      this.logger.warn(`Can't delete Guild(${guildID}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }
  public async createGuildMember(guild: string | Guild, user: string | User) {
    let userID = Database.userIDResolver(user),
      guildID = Database.guildIDResolver(guild);
    if (this.guilds.find(g => g.id == guildID && g.members.find(m => m.userID == userID) as unknown as boolean)) {
      return this.guilds.find(g => g.id == guildID && g.members.find(m => m.userID == userID) as unknown as boolean);
    } else {
      let newGuildMember = await prisma.guildMember.create({
        data: {
          Guild: {
            connect: {
              id: guildID
            }
          },
          User: {
            connect: {
              id: userID
            }
          },
          totalxp: 1
        }
      });
      this.guilds.get(guildID).members.push(newGuildMember);
      return this.guilds.get(guildID);
    }
  }
  public async updateGuildMember(guild: string | Guild, user: string | User, key: string, value: any) {
    let userID = Database.userIDResolver(user),
      guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID) && this.guilds.get(guildID).members.find(m => m.userID == userID)) {
      let gm = this.guilds.get(guildID).members.find(m => m.userID == userID);
      gm[key] = value;
      let data = {};
      data[key] = value;
      return await prisma.guildMember.update({
        where: {
          id: gm.id
        },
        data
      })
    } else {
      this.logger.warn(`Can't update GuildMember(${guildID},${userID}) cuz can't find ('guildID' = '${guildID}' OR 'userID' = '${userID}') in the database`);
      return false;
    }
  }
  public async deleteGuildMember(guild: string | Guild, user: string | User) {
    let userID = Database.userIDResolver(user),
      guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID) && this.guilds.get(guildID).members.find(m => m.userID == userID)) {
      let id = parseInt(`${this.guilds.get(guildID).members.find(m => m.userID == userID).id}`);
      this.guilds.get(guildID).members = this.guilds.get(guildID).members.filter(gm => gm.userID != userID);
      return await prisma.guildMember.delete({
        where: {
          id
        }
      })
    } else {
      this.logger.warn(`Can't delete GuildMember(${guildID},${userID}) cuz can't find ('guildID' = '${guildID}' OR 'userID' = '${userID}') in the database`);
      return false;
    }
  }

  public async createGuildAlias(guild: string | Guild, commandID: string, alias: string) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      let currentCommandAliases = this.guilds.get(guildID).aliases.find(a => a.commandID == commandID);
      if (currentCommandAliases) {
        currentCommandAliases.aliases.push(alias);
        return await prisma.guildAliases.update({
          where: {
            id: currentCommandAliases.id
          },
          data: {
            Guild: {
              connect: {
                id: guildID
              }
            },
            aliases: {
              set: currentCommandAliases.aliases
            }
          }
        });
      } else {
        let newGuildALias = await prisma.guildAliases.create({
          data: {
            Guild: {
              connect: {
                id: guildID
              }
            },
            commandID,
            aliases: {
              set: [alias]
            }
          }
        });
        this.guilds.get(guildID).aliases.push(newGuildALias);
        return newGuildALias;
      }
    } else {
      this.logger.warn(`Can't create GuildAlias(${commandID}=>${alias}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }
  public async deleteGuildAlias(guild: string | Guild, commandID: string, alias: string) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      let currentCommandAliases = this.guilds.get(guildID).aliases.find(a => a.commandID == commandID);
      if (currentCommandAliases) {
        currentCommandAliases.aliases = currentCommandAliases.aliases.filter(a => a != alias);
        return await prisma.guildAliases.update({
          where: {
            id: currentCommandAliases.id
          },
          data: {
            Guild: {
              connect: {
                id: guildID
              }
            },
            aliases: {
              set: currentCommandAliases.aliases
            }
          }
        });
      } else {
        this.logger.warn(`Can't delete GuildAlias(${commandID}=>${alias}) cuz can't find ('commandID' = '${commandID}') in the database`);
        return false;
      }
    } else {
      this.logger.warn(`Can't delete GuildAlias(${commandID}=>${alias}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }
  public async deleteAllCommandAliases(guild: string | Guild, commandID: string) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      let currentCommandAliases = this.guilds.get(guildID).aliases.find(a => a.commandID == commandID);
      let id = parseInt(`${currentCommandAliases.id}`);
      if (currentCommandAliases) {
        this.guilds.get(guildID).aliases = this.guilds.get(guildID).aliases.filter(a => a.id != currentCommandAliases.id);
        return await prisma.guildAliases.delete({
          where: {
            id
          }
        });
      } else {
        this.logger.warn(`Can't delete GuildAliases(${commandID}) cuz can't find ('commandID' = '${commandID}') in the database`);
        return false;
      }
    } else {
      this.logger.warn(`Can't create GuildAliases(${commandID}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }
  public async deleteAllGuildAliases(guild: string | Guild) {
    let guildID = Database.guildIDResolver(guild);
    if (this.guilds.has(guildID)) {
      this.guilds.get(guildID).aliases = [];
      return await prisma.guildAliases.deleteMany({
        where: {
          guildID
        }
      });
    } else {
      this.logger.warn(`Can't create AllGuildAliases(${guildID}) cuz can't find ('guildID' = '${guildID}') in the database`);
      return false;
    }
  }

  public static guildIDResolver(guild: string | Guild): string {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
  public static userIDResolver(user: string | User): string {
    if (user instanceof User) return user.id;
    if (user === "global" || user === null) return "0";
    if (typeof user === "string" && /^\d+$/.test(user)) return user;

    throw new TypeError(
      'User instance is undefined. Valid instances: UserID, "global" or null.'
    );
  }
}