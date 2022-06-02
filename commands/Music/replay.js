const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `restart`,
  category: `Music`,
  aliases: ["replay"],
  description: `Replay the current song`,
  usage: `replay`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //seek to 0
      player.seek(0);
      //send informational message
      const love = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Replay`, message.author.displayAvatarURL( { dynamic: true } ))
      .setDescription(`${emoji.msg.SUCCESS} | Successfully Restarted the current Song`)
      .setColor(ee.color)
      return message.reply({embeds: [love], allowedMentions: { repliedUser: false }});
    } catch (e) {
    
      const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
};
