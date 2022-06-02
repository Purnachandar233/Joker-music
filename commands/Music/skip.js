const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emoji = require(`../../botconfig/emojis.json`);
const ee = require("../../botconfig/embed.json");
const { autoplay } = require("../../handlers/functions");
module.exports = {
  name: "skip",
  category: "Music",
  aliases: ["s"],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  description: "Forces to skip the current song",
  usage: "skip",
  run: async (client, message, args, guildData, player, prefix) => {
    try{
   
      const { channel } = message.member.voice;
      //if the member is not in a channel, return
      if (!channel) {
        const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} | You need to join a voice channel.`)
        return message.reply({embeds: [opop], allowedMentions: { repliedUser: false }})
      }
      //get the player instance
      const player = client.manager.players.get(message.guild.id);
      //if no player available return error | aka not playing anything
      if (!player){
        if(message.guild.me.voice.channel) {
          const newPlayer = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
          })
          newPlayer.destroy();
          const pppp = new MessageEmbed()
          .setDescription(`${emoji.msg.stop}| SuccessFully Stopped and left your Channel`)
          .setColor(ee.color)
          return message.reply({embeds: [pppp], allowedMentions: { repliedUser: false }});
        }
        else {
          const opoppp = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} | No song is currently playing in this guild.`)
          return message.reply({embeds: [opoppp], allowedMentions: { repliedUser: false }});
        }
      }
      
      //if not in the same channel as the player, return Error
      if (channel.id !== player.voiceChannel) {
        const noi = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} | You need to be in my voice channel to use this command!\n\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
        return message.reply({embeds: [noi], allowedMentions: { repliedUser: false }})
      }
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} |  Currently Not Playing anything`)
        return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
      }

      if(player.queue.size == 0) {
        if(player.get("autoplay")) {
        const idkd = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Skip`, message.author.displayAvatarURL( { dynamic: true } ))
        .setDescription(`${emoji.msg.SUCCESS} Skipped **${player.queue.current.title}**`)
        .setColor(ee.color)
          
          message.reply({embeds: [idkd], allowedMentions: { repliedUser: false }});
          return autoplay(client, player, "skip")
        } else {
          player.stop();
          const idkd = new MessageEmbed()
          .setAuthor(`${message.author.tag} - Skip`, message.author.displayAvatarURL( { dynamic: true } ))
          .setDescription(`${emoji.msg.SUCCESS} Skipped **${player.queue.current.title}**`)
         .setColor(ee.color)
          return message.reply({embeds: [idkd], allowedMentions: { repliedUser: false }});
        }
      }

      player.stop();
      const idkd = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Skip`, message.author.displayAvatarURL( { dynamic: true } ))
      .setDescription(`${emoji.msg.SUCCESS} Skipped **${player.queue.current.title}**`)
      .setColor(ee.color)
      return message.reply({embeds: [idkd], allowedMentions: { repliedUser: false }});

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