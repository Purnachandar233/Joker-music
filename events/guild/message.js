const { MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); //Loading all needed functions
const {
  MessageEmbed
} = require(`discord.js`);
//here the event starts
module.exports = async (client, message) => {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!message.guild || !message.channel) return;
    //if the channel is on partial fetch it
    if (message.channel.partial) await message.channel.fetch();
    //if the message is on partial fetch it
    if (message.partial) await message.fetch();
    // if the message  author is a bot, return aka ignore the inputs
    if (message.author.bot) return;
    // Gets guild data
    const guildData = await findOrCreateGuild(client, { id: message.guild.id });
    //get the current prefix from the database
    let prefix = guildData.prefix;
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);

    let not_allowed = false;
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0){
      not_allowed = true;
      if(matchedPrefix.includes(client.user.id)){
        const fff = new Discord.MessageEmbed()
        .setDescription(
`**Hey, I'm Razer Canary**
     **Prefix: ${prefix}**
${emoji.msg.SUCCESS} **40+ Commands**

 **You can play music by joining a voice channel and typing c!play <url/name>. The command accepts song names, video links, & playlist links and Soundcloud.**`)
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
        
        return message.reply({embeds: [fff], components: [row], allowedMentions: { repliedUser: false }})
      }
      return;
    }
    //get the command from the collection
    let command = client.commands.get(cmd);


 if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
      //CHECK IF IN A BOT CHANNEL OR NOT 






      if(guildData.botChannels.toString() !== ""){
        if (!guildData.botChannels.includes(message.channel.id) && !message.member.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
          let leftb = "";
          for(let i = 0; i < guildData.botChannels.length; i++){
              leftb  +="<#" +guildData.botChannels[i] + "> / "
          }
          try{ message.react(emoji.msg.ERROR); }catch{}
          not_allowed = false;
          return;
    
        }
      }
}




    
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    
    //if the command is now valid
    if (command){
      if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
      if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")){
        const x = await message.channel.send({content: `${emoji.msg.ERROR} | I don't have \`EMBED LINKS\` permssion`})
        setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
        return;
      }
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 2.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
        if (timestamps.has(message.author.id)) { //if the user is on cooldown
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
          if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            try{ message.react(emoji.msg.ERROR); }catch{}
            not_allowed = true;
            const idkd = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
            return message.reply({embeds: [idkd], allowedMentions: { repliedUser: false }}); //send an information message
          }
        }
        timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
      try{
        // if Command has specific permission return error
        if(command.memberpermissions) {
          if (!message.member.permissions.has(command.memberpermissions)) {
            try{ message.react(emoji.msg.ERROR); }catch{}
            not_allowed = true;
            const idkf = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
            const x = await message.reply({embeds: [idkf], allowedMentions: { repliedUser: false }})
            setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
            return;
          }
        }
        // if Command has specific permission return error

        

        //if there is a SETUP with an EXISTING text channel and its a MUSIC or FILTER COMMAND                              AND NOT in the                         RIGHT CHANNEL return error msg        and if its request only enabled

        if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
          let neededPermissions = [];
          let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "READ_MESSAGE_HISTORY"]
          required_perms.forEach(perm => {
            if(!message.channel.permissionsFor(message.guild.me).has(perm)){
              neededPermissions.push(perm);
            }
          })
          if(neededPermissions.length > 0){
            const MISSING_BOT_PERMS = new MessageEmbed()
            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | I need ${neededPermissions.map((p) => `\`${p}\``).join(", ")} to execute this command`)
            .setColor(ee.color)
            return message.reply({embeds: [MISSING_BOT_PERMS], allowedMentions: { repliedUser: false }});
          }    
        }

        const player = client.manager.players.get(message.guild.id);
        
        if(command.parameters) {
          if(command.parameters.type == "music"){
             //get the channel instance
            const { channel } = message.member.voice;
            const mechannel = message.guild.me.voice.channel;
            //if not in a voice Channel return error
            if (!channel) {
              not_allowed = true;
              const opop = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You have to be connected to a voice channel before you can use this command.`)
              return message.reply({embeds: [opop], allowedMentions: { repliedUser: false }});
            }
            //If there is no player, then kick the bot out of the channel, if connected to
            if(!player && mechannel) {
              const newPlayer = client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
              })
              newPlayer.destroy();
            }
            //if no player available return error | aka not playing anything
            if(command.parameters.activeplayer){
              if (!player){
                not_allowed = true;
                const udfj = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} |  Currently Not Playing anything`)
                return message.reply({embeds: [udfj] , allowedMentions: { repliedUser: false }});
              }
              if (!mechannel){
                if(player) try{ player.destroy() }catch{ }
                not_allowed = true;
                const mmmm = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | The bot Not connected to a voice channel.`)
                return message.reply({embeds: [mmmm], allowedMentions: { repliedUser: false }});
              }
              if(!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} |  Currently Not Playing anything`)
                return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
              }
            }
            //if no previoussong
            if(command.parameters.previoussong){
              if (!player.queue.previous || player.queue.previous === null){
                not_allowed = true;
                const ifkf = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | There is no previous song yet!`)
                return message.reply({embeds: [ifkf], allowedMentions: { repliedUser: false }});
              }
            }
            //if not in the same channel --> return
            if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
              const ikkkk = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You aren't connected to the same voice channel as I am`)
              return message.reply({embeds: [ikkkk], allowedMentions: { repliedUser: false }});
            }
            //if not in the same channel --> return
            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
              const ikk = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You aren't connected to the same voice channel as I am`)
              return message.reply({embeds: [ikk], allowedMentions: { repliedUser: false }}); 
            }
          }
        }
        //run the command with the parameters:  client, message, args, user, text, prefix,
        if(not_allowed) return;
        command.run(client, message, args, guildData, player, prefix);
        console.log(`${message.author.tag} ran ${command.name}`)
      }catch (e) {
        console.log(String(e.stack).red)
        const dkdk = new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor("An Error Occured")
        .setDescription(`\`\`\`${e.message}\`\`\``)
        const x = await message.channel.send({embeds: [dkdk]})
        setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
        return;
      }
    }
    else //if the command is not found send an info msg
    return;
}