const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `nowplaying`,
  category: `Music`,
  aliases: [`np`, `current`],
  description: `Shows information about the current Song`,
  usage: `nowplaying`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //if no current song return error
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} |  Currently Not Playing anything`)
        return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
      }
      //Send Now playing Message
      const np = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Now Playing`, message.author.displayAvatarURL( { dynamic: true } ))
      .setURL(player.queue.current.uri)
      .setColor(ee.color)
     
      .setTitle(`${player.queue.current.title}`)

        .addField(`Song By `, `\`${player.queue.current.author}\``, true)
            .addField(`Queue length`, `\`${player.queue.length} Songs\``, true)
      .addField(`Duration `, `\`${!player.queue.current.isStream ? `${new Date(player.queue.current.duration).toISOString().slice(11, 19)}` : '◉ LIVE'}\``, true)
      .addField(`Progress`, createBar, true)
      return message.reply({embeds: [np], allowedMentions: { repliedUser: false }});
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
};
