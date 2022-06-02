const {
  MessageEmbed,
  splitMessage
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  inspect
} = require(`util`);

const util = require('util');

const exec = util.promisify(require('child_process').exec);

module.exports = {
  name: `execute`,
  category: `Owner`,
  aliases: [`exec`],
  description: `exec Command`,
  usage: `exec <command>`,
  run: async (client, message, args, guildData, player, prefix) => {


if (!config.ownerIDS.includes(message.author.id)) {
      const nope = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} | You are not allowed to run this command! Only Developers are allowed to run this command`)
      return message.reply({embeds: [nope], allowedMentions: { repliedUser: false }})
    }

let command = args.join(' ');


            
message.reply("Done!")
  const { stdout } = await exec(command);
      const results = new MessageEmbed()
      .addField("Results", `\`\`\`\n${stdout}\n\`\`\``)
.setColor(ee.color)

      message.reply({embeds: [results] , allowedMentions: { repliedUser: false } })
      

     }
} 
