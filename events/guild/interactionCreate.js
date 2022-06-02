const { MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); //Loading all needed functions

const { MessageEmbed } = require(`discord.js`);

const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/911057988717019258/1b2WSLwNkUtjcQwT8GQMrX2dZE_C-G8CLs9AvR1RUg6N9qjvHAGQIfaiHaaafXmjjpnA' });
//here the event starts
module.exports = async (client, interaction) => {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!interaction.guild || !interaction.channel) return;
    // if the message  author is a bot, return aka ignore the inputs
    if (interaction.user.bot) return;
    // Gets guild data
    const guildData = await findOrCreateGuild(client, { id: interaction.guild.id });
    //get the current prefix from the database
    let prefix = guildData.prefix;
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    //get the command name lol
    const cmd = interaction.commandName
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    let not_allowed = false;
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
        //CHECK IF IN A BOT CHANNEL OR NOT
        if(guildData.botChannels.toString() !== ""){
            if (!guildData.botChannels.includes(interaction.channel.id) && !interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                let leftb = "";
                for(let i = 0; i < guildData.botChannels.length; i++){
                    leftb  +="<#" +guildData.botChannels[i] + "> / "
                }
                not_allowed = true;
                
                return;
            }
        }  
    }

    if (command)    {
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return;
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")){
            interaction.reply({ content: `${emoji.msg.ERROR} I don't have \`EMBED LINKS\` permssion`, ephemeral: true })
            return;
        }
            if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
                client.cooldowns.set(command.name, new Discord.Collection());
            }
            const now = Date.now(); //get the current time
            const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
            const cooldownAmount = (command.cooldown || 2.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
            if (timestamps.has(interaction.user.id)) { //if the user is on cooldown
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
                if (now < expirationTime) { //if he is still on cooldonw
                    const timeLeft = (expirationTime - now) / 1000; //get the lefttime
                    not_allowed = true;
                    const idkd = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    return interaction.reply({embeds: [idkd]}); //send an information message
                }
            }
            timestamps.set(interaction.user.id, now); //if he is not on cooldown, set it to the cooldown
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
        try{
            // if Command has specific permission return error
            if(command.memberpermissions) {
                if (!interaction.member.permissions.has(command.memberpermissions)) {
                    not_allowed = true;
                    const idkf = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
                    interaction.reply({ embeds: [idkf], ephemeral: true })
                    return;
                }
            }
            

            if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
                let neededPermissions = [];
                let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "MOVE_MEMBERS" , "READ_MESSAGE_HISTORY"]
                required_perms.forEach(perm => {
                    if(!interaction.channel.permissionsFor(interaction.guild.me).has(perm)){
                        neededPermissions.push(perm);
                    }
                })
                if(neededPermissions.length > 0){
                    const MISSING_BOT_PERMS = new MessageEmbed()
                    .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | I need ${neededPermissions.map((p) => `\`${p}\``).join(", ")} to execute this command`)
                    .setColor("RED");
                    return interaction.editReply({embeds: [MISSING_BOT_PERMS]});
                }    
            }

            const player = client.manager.players.get(interaction.guild.id);
        
            if(command.parameters) {
                if(command.parameters.type == "music"){
                    //get the channel instance
                    const { channel } = interaction.member.voice;
                    const mechannel = interaction.guild.me.voice.channel;
                    //if not in a voice Channel return error
                    if (!channel) {
                        not_allowed = true;
                        const opop = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You have to be connected to a voice channel before you can use this command.`)
                        return interaction.reply({ embeds: [opop] });
                    }
                    //If there is no player, then kick the bot out of the channel, if connected to
                    if(!player && mechannel) {
                        const newPlayer = client.manager.create({
                            guild: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
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
                            .setDescription(`${emoji.msg.ERROR} | There is nothing playing`)
                            return interaction.editReply({embeds: [udfj]});
                        }
                        if (!mechannel){
                            if(player) try{ player.destroy() }catch{ }
                            not_allowed = true;
                            const mmmm = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | I am not connected to a Channel`)
                            return interaction.editReply({embeds: [mmmm]});
                        }
                        if(!player.queue.current) {
                            const no = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | There is nothing playing`)
                            return interaction.editReply({embeds: [no]})
                        }
                    }
                    //if no previoussong
                    if(command.parameters.previoussong){
                        if (!player.queue.previous || player.queue.previous === null){
                            not_allowed = true;
                            const ifkf = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor( `- Error`) 
                .setDescription(`${emoji.msg.ERROR} | There is no previous song`)
                            return interaction.editReply({embeds: [ifkf]});
                        }
                    }
                    //if not in the same channel --> return
                    if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                        const ikkkk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You Need To Join My Channel To Use This Command`)
                        return interaction.editReply({embeds: [ikkkk]});
                    }
                    //if not in the same channel --> return
                    if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                        const ikk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                       .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You Need To Join My Channel To Use This Command`)
                        return interaction.editReply({embeds: [ikk]});
                    }
                }
            }
            //run the command with the parameters:  client, message, args, user, text, prefix,
            if(not_allowed) return;

            if(command.runslash === undefined) {
                const mainmenu = new MessageEmbed()
        .setAuthor(`| Razer Staging Help Commands`,client.user.displayAvatarURL())
               .setDescription(`You can play music by joining a voice channel and typing \`${prefix}play\`. The command accepted, support YouTube links & playlist and names.Accepts playlist links and Spotify links & Soundcloud.If You Feel Any Bugs Than Join [Support Server](https://discord.gg/ATccRnaBQu)`)
.setFooter(`© Use ${prefix}help <command> to get more information about a command`, client.user.displayAvatarURL())        .setThumbnail(client.user.displayAvatarURL())
  
                              
        .addField(`<a:Music:916890138561355807> Music [19]`, `\`join\`, \`clearqueue\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`replay\`, \`resume\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`soundcloud\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``)
        .addField(`<a:filters:916890921805676635> Filters [6]`, `\`8d\`, \`bassboost\`, \`nightcore\`, \`daycore\`, \`clearfilter\`, \`speed\``)
        .addField(`<a:Settings:916890269666922497> Settings [4]
`, `\`24/7\`, \`announce\`, \`autoplay\`, \`Prefix\`, \`bugreport\``)
        .addField(`<a:butterfly:916890687973236756> Info [6]`,`\`help\`, \`invite\`, \`ping\`, \`stats\`, \`node\`, \`info\``)
        .addField(`<a:Owner:916891008376115221> General [8]`,`\`shards\`, \`uptime\`, \`eval\`, \`ping\``)
            
        
.setFooter(`| Thanks for choosing Razer Staging`, interaction.user.displayAvatarURL ({ dynamic: true }))
        .setColor("#16F529")

              const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
          
					.setURL("https://discord.com/api/oauth2/authorize?client_id=910704054592761948&permissions=543581272897&scope=bot%20applications.commands")
          .setLabel("Invite me") 
					.setStyle("LINK")
          .setEmoji("<:invite:918184240431124480>"),
          new MessageButton()
					.setURL("https://discord.gg/ATccRnaBQu")
          .setLabel("Support")
          .setEmoji("<:G_question:917238164085678131>")
					.setStyle("LINK"),
			);
                return interaction.reply({ embeds: [mainmenu], components: [row], ephemeral: false })
            }
            command.runslash(client, interaction, guildData, player, prefix);
            web.send(`${interaction.user.tag} ran ${command.name}`)
        } catch (e) {
            console.log(String(e.stack).red)
            const dkdk = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor("An Error Occured")
            .setDescription(`\`\`\`${e.message}\`\`\``)
            interaction.reply({ embeds: [dkdk] })
            return;
        }
    }
    else //if the command is not found send an info msg
    return;
} 