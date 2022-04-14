module.exports = {
    name: 'edit',
    description: '編輯Giveaway！',

    options: [
        {
            name: 'giveaway',
            description: '結束的Giveaway [訊息 ID]',
            type: 'STRING',
            required: true
        },
        {
            name: 'duration',
            description: '上述Giveaway的設置時間。例如。 1h 將當前Giveaway設置為一個小時後結束！',
            type: 'STRING',
            required: true
        },
        {
            name: 'winners',
            description: 'Giveaway應該有多少獲獎者',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prize',
            description: '贈品的獎品應該是什麼',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: '需要擁有管理消息權限才能開始Giveaway!',
                ephemeral: true
            });
        }
        const gid = interaction.options.getString('giveaway');
        const time = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        
        await interaction.deferReply({
         ephemeral: true
        })
        // Edit the giveaway
        try {
        await client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
        })
        } catch(e) {
return interaction.editReply({
            content:
                `未找到具有給定訊息 ID 的Giveaway: \`${gid}\``,
            ephemeral: true
        });
        }
        interaction.editReply({
            content:
                `此Giveaway現已編輯！`,
            ephemeral: true
        });
    }

};
