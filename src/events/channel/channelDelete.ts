import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

export default class ChannelDeleteEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "channelDelete");
  }

  async execute(bot: Bot, channel: DJS.GuildChannel) {
    try {
      if (!channel.guild.available) return;
      if (!channel.guild.me?.permissions.has(DJS.Permissions.FLAGS.MANAGE_WEBHOOKS)) return;
      const webhook = await bot.utils.getWebhook(channel.guild);
      if (!webhook) return;
      const lang = await bot.utils.getGuildLang(channel.guild.id);

      const type = channel.type === "GUILD_CATEGORY" ? "Category" : "Channel";
      const msg = this.bot.utils.translate(lang.EVENTS.CHANNEL_DELETED_MSG, {
        channel_type: type,
        channel: channel.name,
      });

      const embed = bot.utils
        .baseEmbed({ author: bot.user })
        .setTitle(lang.EVENTS.CHANNEL_DELETED)
        .setDescription(msg)
        .setColor("RED")
        .setTimestamp();

      await webhook.send({ embeds: [embed] });
    } catch (err) {
      bot.utils.sendErrorLog(err, "error");
    }
  }
}
