const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `stop`,
  perms: [ `SEND_MESSAGES` ],
  botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
  category: `Music`,
  aliases: [`leave`, "dis", "disconnect", "dc"],
  description: `Stops current track and leaves the channel`,
  usage: `stop`,
  parameters: {"type":"music", "activeplayer": false, "previoussong": false},
  memberpermissions: [`MANAGE_CHANNELS`],
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //if there is no current track error
      if (!player){
        if(message.guild.me.voice.channel) {
          const newPlayer = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,    
          })
          newPlayer.destroy();
          const ddd = new MessageEmbed()
          .setAuthor(`${message.author.tag} - Stop`, message.author.displayAvatarURL( { dynamic: true } ))
          .setDescription(`${emoji.msg.SUCCESS} | Successfully Stopped and left your Channel`)
          .setColor(ee.color)
          return message.reply({embeds: [ddd], allowedMentions: { repliedUser: false }});
        }
        else {
          const no = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} |  Currently Not Playing anything`)
          return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
        }
      } else {
        player.destroy();
        const ddd = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Stop`, message.author.displayAvatarURL( { dynamic: true } ))
        .setDescription(`${emoji.msg.SUCCESS} | Successfully Stopped and left your Channel`)
        .setColor(ee.color)
        message.reply({embeds: [ddd], allowedMentions: { repliedUser: false }});
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
