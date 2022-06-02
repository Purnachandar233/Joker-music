const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "invite",
  category: "Info",
  aliases: ["add", "inv"],
  cooldown: 5,
  usage: "invite",
  description: "Gives you an Invite link for this Bot",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      const emee = new MessageEmbed()
      .setColor(ee.color)
    
        .setThumbnail(client.user.displayAvatarURL())
      .setAuthor(`- Invite & Support Server`,  message.author.displayAvatarURL({ dynamic: true }))
.addField(`__**Admin**__`, `
[Razer Music](https://discord.com/api/oauth2/authorize?client_id=912000494438854676&permissions=8&scope=bot%20applications.commands)
[Razer Canary](https://discord.com/api/oauth2/authorize?client_id=910704054592761948&permissions=8&scope=bot%20applications.commands)`)

.addField(`__**Without Admin**__`,`[Razer Music (Recommended)](https://discord.com/api/oauth2/authorize?client_id=902594874942042122&permissions=534857121601&scope=bot%20applications.commands)
[Razer Canary (Recommended)](https://discord.com/api/oauth2/authorize?client_id=910704054592761948&permissions=534857121601&scope=bot%20applications.commands)`)
    .addField(`__**Support Server**__`,`[Razer Support Server](https://discord.gg/ATccRnaBQu)`)
      .setFooter(ee.footertext, ee.footericon)
      const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
          
					.setURL("https://discord.com/api/oauth2/authorize?client_id=910704054592761948&permissions=543581272897&scope=bot%20applications.commands")
          .setLabel("Invite me") 
					.setStyle("LINK")
          .setEmoji("<:invite:918184240431124480>"),
          new MessageButton()
					.setURL("https://discord.gg/ATccRnaBQu")
          .setLabel("Support")
          .setEmoji("<:G_question:917238164085678131>")
					.setStyle("LINK"),
			);
      message.author.send({embeds: [emee],components: [row]})
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
}