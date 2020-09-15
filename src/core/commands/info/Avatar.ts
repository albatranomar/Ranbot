import { Command } from "discord-akairo";
import { Message, MessageEmbed, User, Guild } from "discord.js";

export default class AvatarCommand extends Command {
  public constructor() {
    super("avatar", {
      aliases: ["avatar", "avt", 'icon'],
      args: [
        {
          id: 'target',
          type: (message: Message, arg: string) => {
            let checkedUser = this.client.commandHandler.resolver.type('user')(message, arg);
            if (checkedUser) {
              return checkedUser
            } else if (arg == 'server' && message.guild) {
              return message.guild;
            }
            return null;
          },
          default: (message: Message) => message.author
        }
      ],
      description: (m: Message) =>
        m.translate("commands.info.avatar.description"),
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message: Message, { target }: { target: Guild | User }) {
    let avatarEmbed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(message.translate('commands.info.avatar.embed.description'))
    .setFooter(`Requsted by ${message.author.username}`, message.author.displayAvatarURL());
    if (target.id == message.guild?.id) {
      target = target as Guild;
      avatarEmbed.setTitle(message.translate('commands.info.avatar.embed.title', { target: target.name }))
      .setImage(target.iconURL())
      .setURL(target.iconURL());
    } else {
      target = target as User;
      avatarEmbed.setTitle(message.translate('commands.info.avatar.embed.title', { target }))
      .setImage(target.displayAvatarURL())
      .setURL(target.displayAvatarURL());
    }

    message.util.send(avatarEmbed);
  }
}
