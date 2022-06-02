 
const { MessageEmbed} = require("discord.js");
module.exports = {
  name: "help",
  category: "Info",
  description: "Shows The Help Menu Of The Bot",
  runslash: async (client, interaction, args, user, text, prefix,) => {
  

      const mainmenu = new MessageEmbed()
        .setAuthor("• Help Panel", ee.footericon)
        .setThumbnail(client.user.avatarURL())
        .setDescription(`A 24/7 Music Music Bot Which Aims To Provide High Quality Music To People Without Any Obstacles`)
        .addField(`● Config [3]`, `\`24/7\`, \`prefix\`, \`textchannel\``)
        .addField(`● Filters [6]`, `\`8d\`, \`bassboost\`, \`nightcore\`, \`daycore\`, \`reset\`, \`speed\``)
        .addField(`● Music [19]`, `\`autoplay\`, \`clearqueue\`, \`join\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`replay\`, \`resume\`, \`restart\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`soundcloud\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``)
        .addField(`● Owner [4]`, `\`addcode\`, \`reload\`, \`eval\`, \`execute\``)
        .addField(`● Premium [3]`, `\`premium\`, \`redeem\`, \`validity\``)
        .addField(`● Info [6]`, `\`help\`, \`invite\`, \`node\`, \`ping\`, \`stats\`, \`uptime\``)
        .addField(`● Links [2]`, `[Invite Me](lol) | [Support Server](lol)`)
        .setColor("RANDOM")



      interaction.reply({ embeds: [mainmenu] })
    
      const embed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`An Error Occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``);
      return interaction.reply({ embeds: [embed2] });
    }
  }
//nibba my son ekkada ledhu bey ik slash manag
//slash handler naku telusu ide telidhu lol


//arey naku slash handler kavley ra samiii