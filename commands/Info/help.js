 
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "Help",
  aliases: ["help", "h"], 
  category: "Info",
  description: "You get All Commands Information",
  run: async (client, message, args, guildData, player, prefix) => {
    try {

      if (args[0]) {
        const embed = new MessageEmbed()
        .setColor(ee.color);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          embed.setColor(ee.color);
          embed.setDescription(`${emoji.msg.ERROR}| No Commands are there **${args[0].toLowerCase()}**`)
          return message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
        } else if (!cmd && cat) {
          var category = cat;

          const catcommands = client.commands.filter(x => x.category === category).map(x => '`' + x.name + '`').join(", ")

          const embed = new MessageEmbed()
          .setColor(ee.color)
          .setDescription(`● To get help on a specific command type \`${prefix}help <command>\`!`)
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
          .addField(`${emoji.categories[category]} **${category} - (${client.commands.filter((cmd) => cmd.category === category).size})**`, catcommands)
          .setFooter(ee.footertext, client.user.displayAvatarURL());
        
          return message.channel.send({embeds: [embed]})
        }
        if (cmd.name) embed.addField(`${emoji.msg.category} **Command name**`, `\`${cmd.name}\``);
        if (cmd.name) embed.setAuthor(`- Help ${cmd.name}`, message.author.displayAvatarURL({ dynamic: true })
);
        if (cmd.description) embed.addField(`${emoji.msg.info} **Description**`, `\`${cmd.description}\``);
        if (cmd.aliases) try {
          embed.addField(`${emoji.msg.Command} **Aliases**`, cmd.aliases.length > 0 ? cmd.aliases.map(a => "`" + a + "`").join("\n") : "No Aliases")
        .setThumbnail(message.guild.iconURL())
        } catch {}
        if (cmd.cooldown) embed.addField(`${emoji.msg.duration} **Cooldown**`, `\`${cmd.cooldown} Seconds\``);
        else embed.addField(`${emoji.msg.duration} **Cooldown**`, `\`3 Seconds\``);
        if (cmd.usage) {
          embed.addField(`${emoji.msg.usage} **Usage**`, `\`${prefix}${cmd.usage}\``);
          embed.setFooter(`| Use ${prefix}help to get All Commands`,message.guild.iconURL());
        }
        if (cmd.useage) {
          embed.addField(`${emoji.msg.usage} **Usage**`, `\`${prefix}${cmd.useage}\``);
          embed.setFooter(`| Use ${prefix}help to get All Commands`,message.guild.iconURL());
        }
        embed.setColor(ee.color)
        return message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
      } 
  

      const mainmenu = new MessageEmbed()
        
        .setAuthor(`| Razer Canary Help panel `,message.author.displayAvatarURL({ dynamic: true })
)
    .setDescription(`My current prefix in this server is \`${prefix}\` Type \`${prefix}help\` <command name> to get information about a specific  command.`)
                       .setThumbnail(message.guild.iconURL())
  
                              
        .addField(`Music [ 18 ]`, `\`join\`, \`clearqueue\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`replay\`, \`resume\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``)
        .addField(`Filters [ 6 ]`, `\`8d\`, \`bassboost\`, \`nightcore\`, \`daycore\`, \`clearfilter\`, \`speed\``)
        .addField(`Settings [ 5 ] 
`, `\`24/7\`, \`announce\`, \`autoplay\`, \`Prefix\`, \`bugreport\``)
        .addField(`Info [ 9 ]`,`\`help\`, \`invite\`, \`ping\`, \`stats\`, \`node\`, \`info\`,\`uptime\`, \`eval\`, \`ping\``)
        .addField(`General [ 3 ]`,`\`Soundcloud\`, \`Spotify\`, \`YouTube\``)
   .setFooter(`| © Use ${prefix}help <command> to get More information about a command`, message.author.displayAvatarURL({ dynamic: true }))    

        .setColor(ee.color)


    const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          
					.setURL("https://discord.com/api/oauth2/authorize?client_id=910704054592761948&permissions=543581272897&scope=bot%20applications.commands")
          .setLabel("Invite Me!") 
					.setStyle("LINK")
          .setEmoji("<:invite:918184240431124480>"), 
          new MessageButton()
          
					.setURL("https://discord.gg/ATccRnaBQu")
          .setLabel("Vote Me!") 
					.setStyle("LINK")
          .setEmoji("<:topGG:917238373154967582>"), 
          new MessageButton()
					.setURL("https://discord.gg/ATccRnaBQu")
          .setLabel("Support Me!")
          .setEmoji("<:G_question:917238164085678131>")
					.setStyle("LINK"),
          
			);



      message.reply ({ embeds: [mainmenu], components: [row], allowedMentions: { repliedUser: false }})

      
      
 message.channel.send(`For more help. Do Join the support server: https://discord.gg/ATccRnaBQu`)
      
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`An Error Occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({ embeds: [emesdf] });
    }
  }
};

