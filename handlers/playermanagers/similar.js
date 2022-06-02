var {
    MessageEmbed
  } = require("discord.js")
  var ee = require("../../botconfig/embed.json")
  var config = require("../../botconfig/config.json")
  var {
    format
  } = require("../functions")

  var emoji = require("../../botconfig/emojis.json")
//function for playling song
async function similar(client, message, args, type) {
    try {
      //get a playlist out of it
      var mixURL = args.join(" ");
      //get the player instance
      var player = client.manager.players.get(message.guild.id);
      //search for similar tracks
      var res = await client.manager.search(mixURL, message.author);
      //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
      if (!res || res.loadType === 'LOAD_FAILED' || res.loadType !== 'PLAYLIST_LOADED') {
        const yooy = new MessageEmbed()
        .setDescription(`${emoji.msg.ERROR} Found nothing related for the latest Song`)
        .setColor(ee.wrongcolor)
        return client.channels.cache.get(player.textChannel).send({embeds: [yooy]});
      }
      //if its just adding do this
      if (type.split(":")[1] === "add") {
        //send information message
        var embed2 = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Track Queued`, message.author.displayAvatarURL( { dynamic: true } ))  
        .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
        .setColor(ee.color)  
        await message.reply({embeds: [embed2], allowedMentions: { repliedUser: false }})
      }
      //if its seach similar
      if (type.split(":")[1] === "search") {
        var max = 15,
          collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;
        track = res.tracks[0]
  
        var results = res.tracks
          .slice(0, max)
          .map((track, index) => `**${++index})** [\`${String(track.title).substr(0, 60).split("[").join("{").split("]").join("}")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
          .join('\n');
        var searchembed = new MessageEmbed()
          .setTitle(`Search result for: 🔎 **\`${player.queue.current.title}`.substr(0, 256 - 3) + "`**")
          .setColor(ee.color)
          .setDescription(results)
          .setFooter(`Search-Request by: ${track.requester.tag}`, track.requester.displayAvatarURL({
            dynamic: true
          }))
        message.reply({embeds: [searchembed], allowedMentions: { repliedUser: false }})
        const op = new MessageEmbed()
        .setColor(ee.color)
        .setDescription("Pick your Song with the `Number Example : 4)`")
        await message.reply({embeds: [op], allowedMentions: { repliedUser: false }})
        try {
          collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30e3,
            errors: ['time']
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          const yop = new MessageEmbed()
          .setDescription(`${emoji.msg.ERROR} | You didn't provide a selection`)
          .setColor(ee.wrongcolor)
          return message.reply({embeds: [yop], allowedMentions: { repliedUser: false }});
        }
        var first = collected.first().content;
        if (first.toLowerCase() === 'end') {
          if (!player.queue.current) player.destroy();
          const opop = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} | Cancelled selection.`)
          return message.reply({embeds: [opop], allowedMentions: { repliedUser: false }});
        }
        var index = Number(first) - 1;
        if (index < 0 || index > max - 1) {
          const opoppo = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} | The number you provided too small or too big (1-${max}).`)
          return message.reply({embeds: [opoppo], allowedMentions: { repliedUser: false }});
        }

        track = res.tracks[index];
        if (!res.tracks[0]) {
          const fffff = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} | Found nothing for: **${player.queue.current.title.substr(0, 256 - 3)}**`)
          return message.reply({embeds: [fffff], allowedMentions: { repliedUser: false }})
        }
        if (player.state !== "CONNECTED") {
          //set the variables
          // Connect to the voice channel and add the track to the queue
  
          player.connect();
          player.queue.add(track);
          if(message.member.voice.channel.type === "stage") {
            await message.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
          }
          player.play();
          player.pause(false);
        } else {
          player.queue.add(track);
          var embed = new MessageEmbed()
          .setAuthor(`| Added to Queue`)
        .setDescription(`<a:Playing:915811459634692106> **[${track.title}](${track.uri})**`)
        .setColor(ee.color)
          await message.reply({embeds: [embed], allowedMentions: { repliedUser: false }${message.author}})
        }
      }
    } catch (e) {
      console.log(String(e.stack).red)
      const dodo = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${player.queue.current.title.substr(0, 256 - 3)}**`)
      return message.channel.send({embeds: [dodo]})
    }
}

module.exports = similar;