
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "node",
  category: "Info",
  description: "It's Show the Stats of Nodes",
  run: async (client, message, args, guildData, player, prefix) => {
    if (!config.ownerIDS.includes(message.author.id)) {
      const nope = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} | You are not allowed to run this command! Only Developers are allowed to run this command`)
      return message.reply ({embeds: [nope], allowedMentions: { repliedUser: false }})
    }

    const all = client.manager.nodes.map(node => 
      `
Node Id   ::  Node-01
State     ::  Connected
Players   ::  ${node.stats.playingPlayers}/${node.stats.players}
Utipme    ::  ${new Date(node.stats.uptime).toISOString().slice(11, 19)}
Memory    ::  ${Math.round(node.stats.memory.free / 1024 / 1024)}/${Math.round(node.stats.memory.used / 1024 / 1024)}mb
Cores     ::  ${node.stats.cpu.cores}
`
        ).join('\n\n- - - - - - - - - - - - - -\n');

        const embed = new MessageEmbed()
            .setColor(ee.color)
            .setAuthor(`${message.author.tag} - Nodes`,  message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`asciidoc\n${all}\n\`\`\``)
        .setColor(ee.color)
        message.channel.send({embeds: [embed]})

  }
}
   