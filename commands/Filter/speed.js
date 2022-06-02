const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const DBL = require('@top-gg/sdk');
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `speed`,
  category: `Filter`,
  aliases: [ ],
  description: `Allows you to change the speed of current playing track`,
  usage: `speed <Multiplicator> | Multiplicator could be: 0  -  3`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {

    try {

        const isPermGuild = require("../../models/premiumGuild");

      const isPremium = await isPermGuild.findOne({
             GuildID: message.guild.id,
           });
     
           
      if (!args.length) {
        const dfi = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please include the Multiplicator\n\nUsage: \`${prefix}speed <Multiplicator>\`\nExample: \`${prefix}speed 1.5\``)
        return message.reply({embeds: [dfi], allowedMentions: { repliedUser: false }})
      }
      if(isNaN(args[0])) {
        const idk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} The Multiplicator must be a Number\n\nUsage: \`${prefix}speed <Multiplicator>\`\nExample: \`${prefix}speed 1.5\``)
        return message.reply({embeds: [idk], allowedMentions: { repliedUser: false }})
      }
      if(Number(args[0]) >= 3 || Number(args[0]) <= 0) {
        const ppp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Multiplicator out of range | Must be between 0 and 3\n\nUsage: \`${prefix}speed <Multiplicator>\`\nExample: \`${prefix}speed 1.5\``)
        return message.reply({embeds: [ppp], allowedMentions: { repliedUser: false }})
      }
      player.node.send({
        op: "filters",
        guildId: message.guild.id,
        equalizer: player.bands.map((gain, index) => {
            var Obj = {
              "band": 0,
              "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
          }),
        timescale: {
              "speed": Number(args[0]),
              "pitch": 1.0,
              "rate": 1.0
          },
      });
      const lll = new MessageEmbed()
      .setColor(ee.color)
      .setAuthor(`${message.author.tag} - Speed`, message.author.displayAvatarURL( { dynamic: true } ))
      .setDescription(`${emoji.msg.SUCCESS} | Speed Set To : \`${args[0]}\``)
      .setFooter(`Tip : ${prefix}clearfilters`)
      return message.reply({embeds: [lll], allowedMentions: { repliedUser: false }});
        
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]})
    }
  }
};