const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'invite',
    description: '邀請機器人到您的Server！',
    run: async (client, interaction) => {
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel(`邀請 ${client.user.username}`)
        .setStyle('LINK')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new MessageButton()
        .setLabel('Discord支援區')
        .setStyle('LINK')
        .setURL("https://discord.gg/hbZXjAZjv5"),
    )
    let invite = new MessageEmbed()
    .setAuthor(`Invite ${client.user.username} `, client.user.avatarURL())
    .setTitle("邀請連結 & Discord支援區")
    .setDescription(`Invite ${client.user} 帶給你伺服器最好的抽獎體驗!`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter(`made by ${interaction.user.tag} | WebTer | Create by. 幻月貓`, interaction.user.displayAvatarURL())
    interaction.reply({ embeds: [invite], components: [row]});
}
}
