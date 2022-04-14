const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
  const select = new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("Choose a type of giveaway to view!").addOptions([
    {
      label: '🎉 | 普通Giveaways',
      description: '檢查當前在伺服器中運行的正常Giveaway！',
      value: 'normal',
    },
    {
      label: "⚙ 公會要求Giveaway！",
      description: "檢查符合公會要求的Giveaway！",
      value: "guildReq"
    },
  ])
  const row = new Discord.MessageActionRow().addComponents([select])
  let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${message.guild.id}` && !g.ended);
  if (!giveaways.some(e => e.messageId)) {
    return message.reply('沒有Giveaway要顯示')
  }
  const msg = await message.reply({ embeds: [new Discord.MessageEmbed().setDescription("在選擇菜單中選擇一個選項即可開始！").setColor("#2F3136").setTimestamp()], components: [row] })
  let embed = new Discord.MessageEmbed()
    .setTitle("目前活躍的Giveaway")
    .setColor("#2F3136")
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
  let embedGuild = new Discord.MessageEmbed()
    .setTitle("目前活躍的加入要求Giveaway")
    .setColor("#2F3136")
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()

  const filter = x => x.customId == "select" && x.user.id == message.author.id
  const collector = await message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
  collector.on("collect", async (i) => {
    i.update({ components: [] });
    const val = i.values[0]
    if (val == "normal") {
      await Promise.all(giveaways.map(async (x) => {
        embed.addField(`Normal Giveaway:`, `**Prize:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})\nStarted:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Ends:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
      }));
     msg.edit({ embeds: [embed] })
    }
    if (val == "guildReq") {
      if (!giveaways.some(e => e.extraData)) return msg.edit({ content: '💥 No Giveaways To Be Displayed', embeds: [] }).catch(e => console.error(e))
      await Promise.all(giveaways.map(async (x) => {
        if (x.extraData) {
          const guild = client.guilds.cache.get(x.extraData.server)
          const channel = guild.channels.cache
            .filter((channel) => channel.type === 'text')
            .first()
          const inv = await channel.createInvite()
          embedGuild.addField(`加入要求Giveaway:`, `**獎:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})**\n**要求: [這Server](${inv})**\n**開始:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**結束:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
        }
      }));
      msg.edit({ embeds: [embedGuild] })
    }
  })
  collector.on("end",(collected, reason) => {
   if(reason == "time")
   msg.edit({ content: "再試一次！", components: [] })
  })
}

