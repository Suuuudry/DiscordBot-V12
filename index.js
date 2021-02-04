const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const Canvas = require('canvas');
const moment = require('moment');
const createCaptcha = require('./captcha.js');
const config = require('./config.json');
const { Mongoose } = require("mongoose");
const { create } = require("jimp");
const prefix = config.prefix;
const mysql = require('mysql')

const db = new mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "bot"
})

db.connect(function (err) {
    if(err) throw err;

    console.log('La connection à été réussi !')
})

bot.commands = new Discord.Collection();

bot.login(config.token)

bot.on("ready", async () => {
    console.log(`${bot.user.username}): En ligne !`);
bot.user.setActivity(`${bot.users.cache.size} utilisateurs en ligne !`, {type: "STREAMING", url: "https://www.twitch.tv/sudry_"})

});

fs.readdir('./cmds/', (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if(jsfile.length <= 0) {
        console.log('[HANDLER]: Je detecte aucune commande !')
    }
 
    jsfile.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`[HANDLER]: ${f} Prêt !`)
    bot.commands.set(props.help.name, props);
    })
 })
 
 bot.on("message", async message => {

    let blacklisted = ['fdp', 'ntm', 'connard', 'pute', 'putain', 'ta gueule', 'nique', 'salope', 'PD', 'batard', 'putin', 'enfoiré', 'connare', 'fils de pute', 'bâtard', 'bicot', 'conasse', 'couille molle', 'débile', 'ducon', 'dugland', 'enculé', 'fachiste', 'imbécile', 'lavette']

    let foundInText = false;

    for(var i in blacklisted) {
        if(message.content.toLocaleLowerCase().includes(blacklisted[i].toLocaleLowerCase())) foundInText = true;
    }

    if(foundInText) {
        message.delete()

        let AIembed = new Discord.MessageEmbed()
        .setTitle('Anti-insulte')
        .setDescription(`**Vous n'avez pas le droit d'envoyer d'insulte car la config anti insulte est activé !**`)
        .setColor('2f3136')
        .setTimestamp()
        message.channel.send(AIembed)
        }

        bot.on("message", async message => {

            let blacklisted = ['https://','http://','www.','.tv','.com','.fr']
        
            let foundInText = false;
        
            for(var i in blacklisted) {
                if(message.content.toLocaleLowerCase().includes(blacklisted[i].toLocaleLowerCase())) foundInText = true;
            }
        
            if(foundInText) {
                message.delete()
        
                    let ALembed = new Discord.MessageEmbed()
                    .setTitle('Anti-lien')
                    .setDescription(`**Vous n'avez pas le droit d'envoyer de lien car la config anti lien est activé !**`)
                    .setColor('2f3136')
                    .setTimestamp()
                    message.channel.send(ALembed)
                }
            })        

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
 
    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
 
    let commandFile = bot.commands.get(command.slice(prefix.length))
    if(commandFile) commandFile.run(bot, message, args)

//SELECT *
db.query(`SELECT * FROM user WHERE user = ${message.author.id}`, async (err, req) => {
    if(err) throw err;

    if(req.length <1) {
        message.channel.send('Nous allons vous enregistrer dans la base de données.')
        //INSERT
        sql = `INSERT INTO user (user, username, message) VALUES (${message.author.id}, ${message.author.username}, '${message.content}')`
        db.query(sql, function(err){
            if(err) throw err;
        })
    } else {
        return;
    }
});
});

bot.on('guildCreate', async guild => {
db.query(`SELECT * FROM server WHERE guild = ${guild.id}`, async (err, req) => {
if(err) throw err;

if(req.length <1) {
    message.channel.send('Nous allons vous enregistrer dans la base de données.')
    //INSERT
    sql = `INSERT INTO server (guild, setinsulte) VALUES (${guild.id}, 'off')`
    db.query(sql, function(err){
        if(err) throw err;
    })
} else {
    return;
}
});
});

const cdseconds = 5;
 
bot.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    const message = reaction.message;
    const member = message.guild.members.cache.get(user.id)
    const STAFF = message.guild.roles.cache.find(rôles => rôles.name === "STAFF");
    const everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
 
    if(
        ["1️⃣", "2️⃣", "✖️"].includes(reaction.emoji.name)
    ) {

        switch(reaction.emoji.name) {

            case "1️⃣":

                let EmbedHelpAth = new Discord.MessageEmbed()
                .setTitle("**__Liste des commandes :__**")
                .setColor('2f3136')
                .setDescription(`Voici la commande d\'aide pour le bot **${bot.user.username}** : `, 'Mon prefix est : ``.``')
                .addField('⚙️ Administrations : ','``ban`` ``kick`` ``dm`` ``mute`` ``unmute``')
                .addField('🔨 Modération :','``addrole`` ``removerole`` ``clear`` ``ticket`` ``verif``')
                .addField('🔧 Information :','``userinfo`` ``botinfo`` ``serverinfo`` ``channelinfo`` ``covid`` ``instagram`` ``météo``')
                .addField('🎊  Amusement :','``cat`` ``dog`` ``customembed`` ``embed`` ``giveaway`` ``poll`` ``say``')
user.send(EmbedHelpAth);
console.log(message.author)
            break;

            case "2️⃣":

                let EmbedHelpChl = new Discord.MessageEmbed()
                .setTitle("**__Liste des commandes :__**")
                .setColor('2f3136')
                .setDescription(`Voici la commande d\'aide pour le bot **${bot.user.username}** : `, 'Mon prefix est : ``.``')
                .addField('⚙️ Administrations : ','``ban`` ``kick`` ``dm`` ``mute`` ``unmute``')
                .addField('🔨 Modération :','``addrole`` ``removerole`` ``clear`` ``ticket`` ``verif``')
                .addField('🔧 Information :','``userinfo`` ``botinfo`` ``serverinfo`` ``channelinfo`` ``covid`` ``instagram`` ``météo``')
                .addField('🎊  Amusement :','``cat`` ``dog`` ``customembed`` ``embed`` ``giveaway`` ``poll`` ``say``')
                message.channel.send(EmbedHelpChl);

            break;

            case "✖️":

            return message.delete();
            break;
    }
}
});

//Partie du ping = prefix bot

bot.on('message', message => {
    const prefixMention = new RegExp(`^<@!?${bot.user.id}>( |)$`);
           if (message.content.match(prefixMention)) {
               return message.channel.send('Mon prefix est ``.``');
           }
   })
   

//Partie du captcha

bot.on('guildMemberAdd' , async member => {
    
    const SetChannel = member.guild.channels.cache.find(c => c.id === '789871802108608522');
    const captcha = await createCaptcha();
    try {
        const msg1 = (`${member}, Vous avez 60 secondes pour faire le captcha.`, {
            files: [{
                attachment: `${__dirname}/captcha/${captcha}.png`,
                name: `${captcha}.png`
            }]
        })
        SetChannel.send(msg1)
        setTimeout(() => {
            m => m.delete ()
        },100000)

        try {
            const filter = m => {
                if(m.author.bot) return;
                if(m.author.id === member.id && m.content === captcha) return true;
                else {
                SetChannel.send('Votre message ne correspond pas au captcha.')
                member.kick()
                return false;
                }
            }
            const response = await SetChannel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
            if(response) {
                await SetChannel.send('Vous avez réussi le captcha.');
                await member.roles.add('781569050098401350')
                .catch(err => console.log(err))
            }
        } catch(err) {
            console.log(err)
            await SetChannel.send("Vous n'avez pas réussi le captcha !")
            await member.kick()
        }
    } catch(err) {
        console.log(err)
        await SetChannel.send('Vous n\'avez pas réussi le captcha !')
        await member.kick()
    }
});


    bot.on('guildMemberAdd', member => {
    
        const channel1 = member.guild.channels.cache.find(channel => channel.id === "806431276419907615");
    
            const embedjoin = new Discord.MessageEmbed()
                    .setDescription(`⚡ Bienvenue !`)
                    .addField(`${member.user.tag} à rejoint Kalop  ●  Support 🎉`,`Grace à lui nous somme désormais ${member.guild.memberCount} membres sur le serveur`)
                    .setColor('2f3136')
                    channel1.send(embedjoin)
        
        })
         
        bot.on('guildMemberRemove', member => {
        const channel = member.guild.channels.cache.find(channel => channel.id === "806431306928881674");
        
            const embedleave = new Discord.MessageEmbed()
                    .setDescription(`⚡ Au revoir !`)
                    .addField(`${member.user.tag} a quitté Kalop  ●  Support ✈️`,`**Nous sommes désormais ${member.guild.memberCount} membres sur le serveur`)
                    .setColor('2f3136')
                    channel.send(embedleave)
        
        })

        bot.on('messageDelete', async message => {
            if(message.content && message.content.includes("<@")){
            const embedGhostPing = new Discord.MessageEmbed()
            .setColor('2f3136')
            .setAuthor('GHOSTPING')
            .addField('Contenu du ghostping', message.content.length < 1024 ? message.content : 'Contenue trop long')
            .addField('Membre ayant ghostping', message.author.username)
            .setTimestamp()
            .setFooter('UZ BOT')
        bot.channels.cache.get('802909320618311700').send(embedGhostPing)
        }
    })
    


        bot.on('messageUpdate', async (oldMessage, newMessage) => {

            if (oldMessage.content === newMessage.content) {
                return;
            }
    
            const embedLogsMessageUpdate = new Discord.MessageEmbed()
                .setTitle('Message modifié')
                .setColor('2f3136')
                .addField('Avant', `${oldMessage.content}`)
                .addField('Après', `${newMessage.content}`)
                .addField('Salon où le message à été modifié', newMessage.channel)
    
            bot.channels.cache.get('802909320618311700').send(embedLogsMessageUpdate)
                });
            
            bot.on('messageDelete', async message => {

                    const embedLogsMessageDelete = new Discord.MessageEmbed()
                        .setTitle('Message supprimé')
                        .setColor('2f3136')
                        .addField('Contenu du message', message.content)
                        .addField('Salon où le message à été supprimé', message.channel)

            bot.channels.cache.get('802909320618311700').send(embedLogsMessageDelete)
                
                });


            bot.on('roleUpdate', async (oldRole, newRole) => {

                    const embedLogsRoleUpdate = new Discord.MessageEmbed()
                        .setTitle('Rôle mofifié')
                        .setColor('2f3136')
                        .addField('Avant', oldRole.name)
                        .addField('Après', newRole.name)
                        .addField('ID du rôle', role.id)

            bot.channels.cache.get('802918928317284392').send(embedLogsRoleUpdate)
                        
                });

                bot.on('roleCreate', async role => {

                    const embedLogsRoleCreate = new Discord.MessageEmbed()
                        .setTitle('Rôle créer')
                        .setColor('2f3136')
                        .addField('Nom du rôle', role.name)
                        .addField('ID du rôle', role.id)

            bot.channels.cache.get('802918928317284392').send(embedLogsRoleCreate)
                        
                });

                bot.on('roleDelete', async role => {

                    const embedLogsRoleDelete = new Discord.MessageEmbed()
                        .setTitle('Rôle supprimer')
                        .setColor('2f3136')
                        .addField('Nom du rôle', role.name)
                        .addField('ID du rôle', role.id)

            bot.channels.cache.get('802918928317284392').send(embedLogsRoleDelete)
                        
                });

                bot.on('channelCreate', async channel => {

                    const embedchannelCreate = new Discord.MessageEmbed()
                        .setTitle('Salon créer')
                        .setColor('2f3136')
                        .addField('ID du salon', channel.id)
                        .addField('Nom du salon', channel)

            bot.channels.cache.get('802918928317284392').send(embedchannelCreate)
                
                });

                bot.on('channelDelete', async channel => {

                    const embedchannelDelete = new Discord.MessageEmbed()
                        .setTitle('Salon supprimer')
                        .setColor('2f3136')
                        .addField('ID du salon', channel.id)
                        .addField('Nom du salon', channel)

            bot.channels.cache.get('802918928317284392').send(embedchannelDelete)
                
                });

                
                bot.on('emojiCreate', async channel => {

                    const embedemojiCreate = new Discord.MessageEmbed()
                        .setTitle('Emoji créer')
                        .setColor('2f3136')
                        .addField('ID de l\'emoji', emoji.id)
                        .addField('Emoji', emoji)

            bot.channels.cache.get('802832158497439775').send(embedemojiCreate)
                
                });

                bot.on('messageReactionAdd', async(reaction, user) => {
 
                    const message = reaction.message;
                    const member = message.guild.members.cache.get(user.id);
                    const admin = message.guild.roles.cache.find(role => role.name =='STAFF')
                 
                    let tickemessage = message.guild.channels.cache.find(c => c.name == 'ticket')
                 
                 
                    if(user.bot) return;
                 
                    if(
                        ["📝", "🔒"].includes(reaction.emoji.name)
                    ) {
                        switch(reaction.emoji.name) {
                            case "📝":
                 
                            reaction.users.remove(user);
                 
                            let username = user.username;
                            let categoryID = "768767599067660298";
                            let channel = await message.guild.channels.create(`ticket-${username}`, {type: 'text', parent: message.guild.channels.cache.get(categoryID)})
                            .catch(err => {
                                message.channel.send('Il y a eu une erreur dans le [MessageReactionAdd]')
                            });
                 
                            channel.updateOverwrite(message.guild.roles.everyone, {'VIEW_CHANNEL': false});
                            channel.updateOverwrite(member, {
                                'VIEW_CHANNEL': true,
                                'SEND_MESSAGE': true,
                                'ADD_REACTIONS': true
                            });
                            channel.updateOverwrite(message.guild.roles.cache.find(role => role.name =='STAFF'), {'VIEW_CHANNEL':true });
                 
                            var embed1 = new Discord.MessageEmbed()
                            .setTitle('Bonjour,')
                            .setDescription('Pour gagner du temps merci de précicez votre problème')
                 
                            channel.send(`Bienvenue dans votre ticket, ${member}, un administrateur arrive.`)
                            channel.send(embed1).then(async message => message.react('🔒'))
                 
                 
                            let logchannel = message.guild.channels.cache.find(c => c.name == 'log')
                            if(!logchannel) return;
                            logchannel.send(`${member.user.tag} à créé le ticket. ${channel}`)
                 
                            break;
                 
                            case "🔒":
                 
                                if(!message.channel.name.startsWith('ticket')) return;
                                if(!member.hasPermission('ADMINISTRATOR')) return;
                                let logchannel2 = message.guild.channels.cache.find(c => c.name == 'log')
                                if(!logchannel2) return;
                                await logchannel2.send(`${member.user.tag} à fermé le ticket ${message.channel.name}`);
                                channel.updateOverwrite(member, {
                                    'VIEW_CHANNEL': false
                                });
                              //  message.channel.delete()
                            break;
                 
                 
                 
                        }
                    }})

                
        bot.on('message', message => {
            if(message.content.startsWith(prefix+"leave")){
            if(!message.author.id == "502151443420020776")return undefined;
            var id = message.content.split(" ")[1];
            if(!id)return message.channel.send(':erreur: | Merci de m\'entionner l\'id du serveur à quitter !')
            var guild = bot.guilds.cache.get(id);
            if(!guild)return message.channel.send(":erreur: | Je ne suis pas présent dans ce serveur !")
        guild.leave();
            message.channel.send(`:valid: | Je ne suis désormais plus dans le serveur ${guild}`)
        }
        });