import { Guild, Collection, User } from "discord.js";
import { EventEmitter } from "events";
import { User as dbUser, UserLevel, Guild as dbGuild, GuildMember } from "@prisma/client";
import dotprop from "dot-prop";

interface defaultUsersCollectionSchema extends dbUser {
  level: UserLevel
};

interface defaultGuildsCollectionSchema extends dbGuild {
  members: GuildMember[]
};

/**
 * @type {dbUser}
 */
const defaultUserSettings = {
  totalxp: 1,
  likes: 0,
  coins: 1,
  bio: 'come back later(OMAR)',
};

/**
 * @type {dbGuild}
 */
const defaultGuildSettings = {
  prefix: '-',
  lang: "en-US"
};

/**
 * @type {UserLevel}
 */
const defaultUserLevel = {
  current: 1,
  xp: 1,
  levelup: 500,
};

export class Database extends EventEmitter {
  public guilds = new Collection<string, defaultGuildsCollectionSchema>();
  public users = new Collection<string, defaultUsersCollectionSchema>();

  public async init(): Promise<void> {
    this.emit("initialized");
    for (const guild of await prisma.guild.findMany()) {
      guild["members"] = await (await prisma.guildMember.findMany({ where: { guildID: guild.id } }));
      this.guilds.set(guild.id, guild as defaultGuildsCollectionSchema);
    }
    for (const user of await prisma.user.findMany()) {
      user["level"] = await prisma.userLevel.findOne({ where: { userID: user.id } });
      this.users.set(user.id, user as defaultUsersCollectionSchema);
    }
  }

  public async setUsers(user: string | User, path: string, value: any) {
    let userID = Database.userIDResolver(user);
    let item = this.users.get(userID) ?? (await this.newUser(userID));
    dotprop.set(item, path, value);
    this.users.set(userID, item);
    this.emit("setUsers", user, path, value);
    return await prisma.user.update({
      where: { id: userID }, data: {
        totalxp: item.totalxp,
        likes: item.likes,
        coins: item.coins,
        bio: item.bio,
        UserLevel: {
          update: [{
            where: { userID },
            data: { ...item.level }
          }]
        }
      }
    })
  }
  public async setGuilds(guild: string | Guild, path: string, value: any) {
    let guildID = Database.guildIDResolver(guild);
    let item = this.guilds.get(guildID) ?? (await this.newGuild(guildID));
    dotprop.set(item, path, value);
    this.guilds.set(guildID, item);
    this.emit("setGuilds", guild, path, value);
    return await prisma.guild.update({
      where: { id: guildID }, data: {
        lang: item.lang,
        prefix: item.prefix,
        GuildMember: {
          update: item.members.map((gm) => {
            return {
              where: {
                id: gm.id
              },
              data: {
                totalxp: gm.totalxp
              }
            }
          })
        }
      }
    })
  }

  public async newUser(user: string | User): Promise<defaultUsersCollectionSchema> {
    let userID = Database.userIDResolver(user);
    let item = this.users.get(userID);
    if (!item) {
      let theNewUser = await prisma.user.create({
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
      theNewUser["level"] = await prisma.userLevel.findOne({ where: { userID } });
      item = theNewUser as defaultUsersCollectionSchema;
    }
    return item;
  }
  public async newGuild(guild: string | Guild): Promise<defaultGuildsCollectionSchema> {
    let guildID = Database.guildIDResolver(guild);
    let item = this.guilds.get(guildID);
    if (!item) {
      let theNewGuild = await prisma.guild.create({
        data: {
          id: guildID,
          ...defaultGuildSettings
        }
      });
      theNewGuild["members"] = await prisma.guildMember.findMany({ where: { guildID } });
      item = theNewGuild as defaultGuildsCollectionSchema;
    }
    return item;
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