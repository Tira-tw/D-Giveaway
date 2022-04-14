const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle('❓你剛剛從Giveaway中刪除了一個反應嗎？')
        .setColor("#2F3136")
        .setDescription(
          `您進入 [這Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})被記錄但你沒有反應，因為你不需要 **${giveaway.prize}** 不得不選擇其他人 😭`
        )
        .setFooter("認為這是一個錯誤？再去反應！")
      ]
    }).catch(e => {})

  }
}