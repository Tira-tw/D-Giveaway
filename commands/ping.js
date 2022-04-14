const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
  let m = await message.reply("向 websocket 發送請求...")
  let pong = new Discord.MessageEmbed()
    .setAuthor(`🏓 ping! dowob`, message.author.displayAvatarURL)
    .setTitle("Ping")
    .setColor('#2F3136')	
    .setTimestamp()
    .addField("延遲", `${m.createdTimestamp - message.createdTimestamp}ms`, true)
    .addField("API 延遲", `${Math.round(client.ws.ping)}ms`, true)
    .setFooter(`made by. ${message.author.tag}`, message.author.displayAvatarURL());
     m.delete()
  message.reply({ content: " ", embeds: [pong] })
}