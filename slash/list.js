const Discord = require("discord.js")

module.exports = {
    name: 'list',
    description: '🎉 列出該公會的所有活動Giveaway!',
    run: async (client, interaction) => {
        const select = new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("選擇要查看的Giveaway類型!").addOptions([
            {
              label: '🎉 普通Giveaway',
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
          let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${interaction.guild.id}` && !g.ended);
          if (!giveaways.some(e => e.messageId)) {
            return interaction.reply('沒有Giveaway要顯示')
          }
  const msg = await interaction.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("在選擇菜單中選擇一個選項即可開始！").setColor("#2F3136").setTimestamp()], components: [row] })
          let embed = new Discord.MessageEmbed()
            .setTitle("目前活躍的贈品")
            .setColor("#2F3136")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
          let embedGuild = new Discord.MessageEmbed()
            .setTitle("目前活躍的加入要求Giveaway")
            .setColor("#2F3136")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
          const filter = x => x.customId == "select" && x.user.id == interaction.member.id
          const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
          await interaction.deferReply()
          collector.on("collect", async (i) => {
            const val = i.values[0]
            if (val == "normal") {
              await Promise.all(giveaways.map(async (x) => {
                embed.addField(`普通Giveaway:`, `**獎:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\n開始:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**結束:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
              }));
              msg.delete()
              interaction.editReply({ embeds: [embed], components: [] })
            }
            if (val == "guildReq") {
               if (val == "guildReq") {
              if (!giveaways.some(e => e.extraData)){  interaction.editReply({ content: '💥 No Giveaways To Be Displayed', embeds: [], components: [] })
               msg.delete()
               return
            }
               }
              await Promise.all(giveaways.map(async (x) => {
                if (x.extraData) {
                  const guild = client.guilds.cache.get(x.extraData.server)
                  const channel = guild.channels.cache
                    .filter((channel) => channel.type === 'text')
                    .first()
                  const inv = await channel.createInvite()
                  embedGuild.addField(`加入要求Giveaway:`, `**獎:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})**\n**要求: [這Server](${inv})**\n**開始:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**結束:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
                }
              }));
              msg.delete()
              interaction.editReply({ embeds: [embedGuild], components: [] })
              
            }
          })
          collector.on("end",(collected, reason) => {
            if(reason == "time"){
         interaction.editReply({ content: "再試一次！", components: [] })
            }
        })  
    },
};