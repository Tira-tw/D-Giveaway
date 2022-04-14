const { MessageEmbed , MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: 'help',
    description: '查看機器人可用的所有指令！',
    run: async (client, interaction) => {
        const embed = new MessageEmbed()
        .setTitle(`Commands of ${client.user.username}`)
        .setColor('#2F3136')
        .setDescription('**請選擇一個類別以查看其所有指令!**')
        .addField(`Links:`,`- [Github](https://github.com/Tira-tw)\n- [Discord](https://discord.gg/hbZXjAZjv5)`,true)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.username} | | WebTer | 幻月貓 Create`, interaction.user.displayAvatarURL());
        
          const giveaway = new MessageEmbed()
          .setTitle("類別 » Giveaway")
          .setColor('#2F3136')
          .setDescription("```yaml\n這是Giveaway命令:```")
          .addFields(
            { name: 'Create / Start'  , value: `在您的Server中開始Giveaway！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'Edit' , value: `編輯已經運行的贈Giveaway！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'End' , value: `結束已經在運行的Giveaway！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'List' , value: `列出這個Server內運行的所有Server！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'Pause' , value: `暫停已經在運行的Giveaway！\n > **Type: __\`slash\`__**`, inline: true },
            { name: 'Reroll' , value: `重新換人 | 結束的Giveaway!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'Resume' , value: `恢復暫停的Giveaway!\n > **Type: __\`slash\`__**`, inline: true },
          )
          .setTimestamp()
          .setFooter(`made by. ${interaction.user.username} | | WebTer | 幻月貓 Create`, interaction.user.displayAvatarURL());
        
        
          const general = new MessageEmbed()
          .setTitle("類別 » General")
          .setColor('#2F3136')
          .setDescription("```yaml\n以下是一般機器人指令:```")
          .addFields(
            { name: 'Help'  , value: `顯示此機器人的所有可用指令！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'Invite' , value: `獲取機器人的邀請鏈接！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
            { name: 'Ping' , value: `檢查機器人的延遲！\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
          )
          .setTimestamp()
          .setFooter(`made by ${interaction.user.username} | | WebTer | 幻月貓 Create`, interaction.user.displayAvatarURL());
        
          const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId("help-menu")
                .setPlaceholder("請選擇一個類別")
                .setDisabled(state)
                .addOptions([{
                        label: `Giveaways`,
                        value: `giveaway`,
                        description: `查看所有基於Giveaway的指令！`,
                        emoji: `🎉`
                    },
                    {
                        label: `General`,
                        value: `general`,
                        description: `查看所有常規機器人指令！`,
                        emoji: `⚙`
                    }
                ])
            ),
        ];
        
        const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });
        
        const filter = (interaction) => interaction.user.id === interaction.member.id;
        
                const collector = interaction.channel.createMessageComponentCollector(
                    {
                        filter,
                        componentType: "SELECT_MENU",
                        time: 3000000
                    });
        
                collector.on('collect', (interaction) => {
                    if (interaction.values[0] === "giveaway") {
                        interaction.update({ embeds: [giveaway], components: components(false) });
                    } else if (interaction.values[0] === "general") {
                        interaction.update({ embeds: [general], components: components(false) });
                    }
                });
                collector.on('end', () => {
                  initialMessage.edit({ components: components(true) });
              }
              )
    },
};