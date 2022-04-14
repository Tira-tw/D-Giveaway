const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.MessageEmbed()
          .setTitle(`🎁 Let's gooooo!`)
          .setColor("#2F3136")
          .setDescription(`Hello ${member.user}\n 聽說你贏了 **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n 做得好 **${giveaway.prize}!**\n私信主持人領取獎品!!owo`)
          .setTimestamp()
          .setFooter(member.user.username, member.user.displayAvatarURL())
        ]
      }).catch(e => {})
    });

  }
}