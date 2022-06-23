import * as Discord from 'discord.js'
import * as fs from 'fs'
import * as crypto from 'crypto'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

const db = new JsonDB('./data', true, true, '/')
if (!db.exists('/liferoll')) db.push('/liferoll',{})

const Client = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]})
var auth = fs.readFile('../auth.json','utf8', (err, data) => {
    let hello = JSON.parse(data) as {jdbot:string}
    Client.login(hello.jdbot)
})

function onReady () {
    console.log(`> welcome\n> bot user ${Client.user?.tag} is online~`)
    Client.user?.setPresence({activities: [{ name: 'github.com/DayDarkTV/jdbot'}], status:'online'})
}
function onMessage(msg:Discord.Message) {
    let text = msg.content.trim()
    let channel = msg.channel as Discord.GuildChannel
    if (msg.author.tag === 'jdbot#9588') return
    console.log(`> new message sent by ${msg.author.tag} in channel #${channel.name} in server ${msg.guild?.name}`)
    console.log(`> '${text}'`)
    if (text.startsWith('jd.lifeRoll')) {
        if (!db.exists(`/liferoll/${msg.author.id}`)) db.push(`/liferoll/${msg.author.id}`, {time:0})
        msg.channel.sendTyping()
        let daytime = 1000 * 60 * 60 * 24
        if ((db.getObject<number>(`/liferoll/${msg.author.id}/time`)) <= (Date.now() - daytime)){
            let username = Client.user?.tag ?? 'jdbot'
            let _temp1 = random(1, 50)
            if (typeof _temp1 === 'boolean') _temp1 = 0
            let _temp2 = random(1, 50)
            if (typeof _temp2 === 'boolean') _temp2 = 0
            const num1 = Math.round(_temp1)
            const num2 = Math.round(_temp2)
            const win = (num1 === num2)
            const soclose = ((num1-num2) === (-1 | 1))
            console.log(`> user ${msg.member?.user.tag} has taken their chance!`)
            console.log(`> they ${win?'won':'lost'} with numbers ${num1} and ${num2}${win?'!':''}~`)
            if (!soclose) db.push(`/liferoll/${msg.author.id}/time`, Date.now())
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: msg.author.tag, iconURL: `${msg.author.avatarURL({dynamic:true})}`})
                .setTitle(`your rolls...`)
                .setDescription(`you ${win?'won':'lost'}! \nyour rolls were ${num1} and ${num2}${win?'!':''}~ \n${win?`contact <@> or <@737365428078116955> for your life~!`:`${soclose?'your numbers were so close that you get a second try :> the command should let you try again :D':''}`}`)
                .setFooter({ text: username, iconURL: `${Client.user?.avatarURL({dynamic:true})??'https://cdn.discordapp.com/avatars/737365428078116955/d44b735761a65696f8ab108c5e25237d.webp'}` })
            msg.channel.send({embeds:[embed]})
        } else {
            let username = Client.user?.tag ?? 'jdbot'
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: msg.author.tag, iconURL: `${msg.author.avatarURL({dynamic:true})}`})
                .setTitle(`not yet~!`)
                .setDescription(`cannot use this command yet~ (24hr cooldown)`)
                .setFooter({ text: username, iconURL: `${Client.user?.avatarURL({dynamic:true})??'https://cdn.discordapp.com/avatars/737365428078116955/d44b735761a65696f8ab108c5e25237d.webp'}` })
            msg.channel.send({embeds: [embed]})
        }
    }
}

Client.on('ready', onReady)
Client.on('messageCreate', (msg) => {onMessage(msg)})


function random(minimum:number, maximum:number){
	var distance = maximum-minimum;
	
	if(minimum>=maximum){
		console.log('Minimum number should be less than maximum');
		return false;
	} else if(distance>281474976710655){
		console.log('You can not get all possible random numbers if range is greater than 256^6-1');
		return false;
	} else if(maximum>Number.MAX_SAFE_INTEGER){
		console.log('Maximum number should be safe integer limit');
		return false;
	} else {
		var maxBytes = 6;
		var maxDec = 281474976710656;
		
		// To avoid huge mathematical operations and increase function performance for small ranges, you can uncomment following script
		/*
		if(distance<256){
			maxBytes = 1;
			maxDec = 256;
		} else if(distance<65536){
			maxBytes = 2;
			maxDec = 65536;
		} else if(distance<16777216){
			maxBytes = 3;
			maxDec = 16777216;
		} else if(distance<4294967296){
			maxBytes = 4;
			maxDec = 4294967296;
		} else if(distance<1099511627776){
			maxBytes = 4;
			maxDec = 1099511627776;
		}
		*/
		
		var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
		var result = Math.floor(randbytes/maxDec*(maximum-minimum+1)+minimum);
		
		if(result>maximum){
			result = maximum;
		}
		return result;
	}
}