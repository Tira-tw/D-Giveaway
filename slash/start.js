const Discord = require("discord.js")
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 開始Giveaway',

  options: [
    {
      name: 'duration',
      description: 'Giveaway持續多長時間。示例：1m、1h、1d',
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
      description: 'Giveaway的獎品應該是什麼',
      type: 'STRING',
      required: true
    },
    {
      name: 'channel',
      description: '開始Giveaway的頻道',
      type: 'CHANNEL',
      required: true
    },
    {
      name: 'bonusrole',
      description: '將獲得獎金條目的角色',
      type: 'ROLE',
      required: false
    },
    {
      name: 'bonusamount',
      description: '角色將獲得的獎勵條目數量',
      type: 'INTEGER',
      required: false
    },
    {
      name: 'invite',
      description: '邀請您要添加為Giveaway加入要求的Server',
      type: 'STRING',
      required: false
    },
    {
      name: 'role',
      description: '您要作為Giveaway加入要求添加的角色',
      type: 'ROLE',
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: '需要擁有管理消息權限才能開始Giveaway!',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: '請選擇文字頻道！',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: '請選擇一個有效的持續時間！',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: '請選擇有效的獲勝者人數！大於或等於一。',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `必須指定有多少獎金條目將 ${bonusRole} 收到!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
        return interaction.editReply({
          embeds: [{
            color: "#2F3136",
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Server Check!",
            url: "https://discord.gg/3qSBxmaHqG",
            description:
              "想要在GTAV線上模式當富豪嗎? , 但是目標太遠沒辦法達成嗎? , 沒關係我們幫你 , Mal-GTAV代刷團隊 , 2022 4/10創立的代刷團隊 \n ```fix\nQ : 會很貴嗎?\n```\nHI owo\n```ini\n[A : 不貴! , 你想要多少我們願意幫你! , 最低便宜價100多!]\n```\n心動了嗎?\n那就加入吧~\n > [Mal-GTAV代刷團隊官方Discord](https://discord.gg/3qSBxmaHqG)\n> [Mal-GTAV代刷團隊網站](https://mgv-gtav.ml/)\n> [Mal-GTAV代刷團隊Facebook](https://www.facebook.com/MalGTAV)\n> [Mal-GTAV代刷團隊宣傳文](https://mgv-gtav.ml/Promotional-text.html)",
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Server 查看"
            }
          }]
        })
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**點擊 🎉 代表參與活動!**\n>>> - 只有members有 ${rolereq}被允許參加這個Giveaway！`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**點擊 🎉 代表參與活動!**\n>>> - 只有members有 ${rolereq} 被允許參加這個Giveaway！\n- members必須加入[此Server](${invite}) 參加這個Giveaway！`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**點擊 🎉 代表參與活動!**\n>>> - members必須加入[此Server](${invite}) 參加這個Giveaway！`
    }


    // start giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Giveaway started in ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.MessageEmbed()
        .setAuthor(`獎金條目警報！`)
        .setDescription(
          `**${bonusRole}** 擁有 **${bonusEntries}** 此贈品中的額外條目！`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
