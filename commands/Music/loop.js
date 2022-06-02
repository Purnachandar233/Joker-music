const {
  MessageEmbed
} = require(`discord.js`);
const DBL = require('@top-gg/sdk');
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `loop`,
  category: `Music`,
  aliases: [`repeat`, `l`],
  description: `Repeats the current song`,
  usage: `loopsong`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {
     

      //if no args send error
      if (!args[0]) {
        const tdk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} | Invalid arguments \`Queue/track\``)
        return message.reply ({embeds: [tdk], allowedMentions: { repliedUser: false }})
      }
      //if arg is somehow song / track
      if (args[0].toLowerCase() === `q` || args[0].toLowerCase() === `track` || args[0].toLowerCase() === `queue` || args[0].toLowerCase() === `t`) {
        //Create the Embed
        let embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Loop`, message.author.displayAvatarURL( { dynamic: true } ))
        .setDescription(`${emoji.msg.SUCCESS} | Track loop ${player.trackRepeat ? `Disabled` : `Enabled`} Successfully`)
        .setColor(ee.color)
        //If Queue loop is enabled add embed info + disable it
        if (player.queueRepeat) {
          player.setQueueRepeat(false);
        }
        //toggle track repeat to the reverse old mode
        player.setTrackRepeat(!player.trackRepeat);
        //Send Success Message
        return message.reply ({embeds: [embed], allowedMentions: { repliedUser: false }});
      }
      //if input is queue
      else if (args[0].toLowerCase() === `queue` || args[0].toLowerCase() === `qu` || args[0].toLowerCase() === `q`) {
        //Create the Embed
        let embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Loop`, message.author.displayAvatarURL( { dynamic: true } ))
          .setDescription(`${emoji.msg.SUCCESS} | Queue loop ${player.queueRepeat ? `Disabled` : `Enabled`} Successfully`)
          .setColor(ee.color)
        //If Track loop is enabled add embed info + disable it
        if (player.trackRepeat) {
          player.setTrackRepeat(false);
        }
        //toggle queue repeat to the reverse old mode
        player.setQueueRepeat(!player.queueRepeat);
        //Send Success Message
        return message.reply ({embeds: [embed], allowedMentions: { repliedUser: false }});
      }
      //if no valid inputs, send error
      else {
        const ror = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(`${emoji.msg.ERROR} Please add your method!`)
        .setDescription(`\`loop song\`\n\`loop queue\``)
        return message.reply ({embeds: [ror], allowedMentions: { repliedUser: false }});
      }
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