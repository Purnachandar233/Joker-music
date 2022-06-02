var {
  MessageEmbed
} = require("discord.js");
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json")
var {
  format
} = require("../functions")
const emoji = require("../../botconfig/emojis.json")
//function for playing playlists kkrh ?
async function playtop(client, message, args, type) {

  const search = args.join(" ");
  let res;
      
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, message.author);

  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") throw res.exception;
  else if (res.loadType === "PLAYLIST_LOADED") {
      return require("../../handlers/playermanagers/playlist")(client, message, args, type);
  } else {
      song_()
  }
  async function song_() {
    //if no tracks found return info msg
    if (!res.tracks[0]){
      const op = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return message.channel.send({embeds: [op]});
    }

    //create a player if not created
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false
    });
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //connect to the channel
      player.connect()
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      if(message.member.voice.channel.type === "stage") {
        try { message.guild.me.voice.setSuppressed(false) } catch {/** */}
      }
      player.play();
    } else {
      //save old tracks on an var
      let oldQueue =[]

      for(const track of player.queue)
      oldQueue.push(track);

      //clear queue
      player.queue.clear();

      //add new tracks
      player.queue.add(res.tracks[0]);

      //now add every old song again
      for (const track of oldQueue)
      player.queue.add(track);
      var playembed = new MessageEmbed()
      .setAuthor(`| Added to Queue`, message.author.displayAvatarURL( { dynamic: true } ))  
      .setDescription(`<a:Playing:915811459634692106> **[${track.title}](${track.uri})**`)
      .setColor(ee.color)
      await message.reply({embeds: [playembed], allowedMentions: { repliedUser: false }})
    }
  }
}
/// yep wo circle accha noi lg raha only auhot rendehmmmmmmm ok
///// abe wo author ka image kahase nikale kaha he wo avatar ?? wait hata deta
// erela_events/events.js

module.exports = playtop;