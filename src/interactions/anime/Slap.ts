import { hyperlink } from "@discordjs/builders";
import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";

export default class SlapCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "anime",
      name: "slap",
      description: "Slap somebody",
      options: [
        {
          name: "user",
          description: "A user",
          type: "USER",
          required: false,
        },
      ],
    });
  }

  async execute(
    interaction: DJS.CommandInteraction<"cached">,
    lang: typeof import("@locales/english").default,
  ) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const slapped = interaction.user.id === user.id ? "themselves" : user.username;

    const data = await this.bot.neko.slap();
    const link = hyperlink(lang.IMAGE.CLICK_TO_VIEW, data.url);

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setTitle(`${interaction.user.username} ${lang.IMAGE.SLAPPED} ${slapped}`)
      .setDescription(link)
      .setImage(data.url);

    await interaction.reply({ embeds: [embed] });
  }
}
