module.exports.run = async (client, message) => {
  const Discord = require("discord.js");
  const ms = require("ms");
  let time = "";
  let winnersCount;
  let prize = "";
  let giveawayx = "";
  let embed = new Discord.MessageEmbed()
    .setTitle("編輯Giveaway！")
    .setColor('#2F3136')
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp();
  const msg = await message.reply({
    embeds:
      [embed.setDescription(
        "您要編輯哪個Giveaway？\n提供Giveaway消息的 ID\n **必須在 30 秒內回复！**"
      )]
  }
  );
  let xembed = new Discord.MessageEmbed()
    .setTitle("超時！ 🕖")
    .setColor("#FF0000")
    .setDescription('💥 抓住我們的運氣！\n你花了太多時間來決定！\nUse ``edit``再次編輯Giveaway！\n這次嘗試在 **30 秒**內回复！')
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp();

  const filter = m => m.author.id === message.author.id && !m.author.bot;
  const collector = await message.channel.createMessageCollector(filter, {
    max: 3,
    time: 30000
  });

  collector.on("collect", async collect => {

    const response = collect.content;
    let gid = BigInt(response).toString()
    await collect.delete()
    if (!gid) {
      return msg.edit({
        embeds: [
          embed.setDescription(
            "您提供的消息 ID 似乎無效！\n**再試一次？**\n Example: ``677813783523098627``"
          )]
      }
      );
    } else {
      collector.stop(
        msg.edit({
          embeds: [
            embed.setDescription(
              `ok接下來，我們將在什麼時候結束Giveaway \n** 必須在 30 秒內回复！**`
            )]
        }
        )
      );
    }
    const collector2 = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
    collector2.on("collect", async collect2 => {

      let mss = ms(collect2.content);
      await collect2.delete()
      if (!mss) {
        return msg.edit({
          embeds: [
            embed.setDescription(
              "哦，快！看起來你為我提供了無效的時長\n**再試一次？**\n Example: ``-10 minutes``,``-10m``,``-10``\n **Note: - (minus)表示你想減少時間！**"
            )]
        }
        );
      } else {
        time = mss;
        collector2.stop(
          msg.edit({
            embeds: [
              embed.setDescription(
                `好的！接下來，我現在應該如何為Giveaway獲獎者？\n**必須在 30 秒內回复。**`
              )]
          }
          )
        );
      }
      const collector3 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
        errors: ['time']
      });
      collector3.on("collect", async collect3 => {

        const response3 = collect3.content.toLowerCase();
        await collect3.delete()
        if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "獲勝者必須是數字或大於等於一！\n**再試一次？**\n Example ``1``,``10``, etcetra."
              )]
          }
          );
        } else {
          winnersCount = parseInt(response3);
          collector3.stop(
            msg.edit({
              embeds: [
                embed.setDescription(
                  `接下來，Giveaway的新獎品應該是什麼？\n**必須在 30 秒內回复！**`
                )]
            }
            )
          );
        }
        const collector4 = await message.channel.createMessageCollector(
          filter,
          { max: 3, time: 30000 }
        );
        collector4.on("collect", async collect4 => {

          const response4 = collect4.content.toLowerCase();
          prize = response4;
          await collect4.delete()
          collector4.stop(
            console.log(giveawayx),
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Edited`
                )]
            }
            )
          );
          client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
          })
        });
      });
    });
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
      message.reply({ embeds: [xembed] });
    }
  })
  try {
    collector2.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.reply({ embeds: [xembed] });
      }
    });
    collector3.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });

      }
    })
    collector4.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.reply({ embeds: [xembed] });
      }
    })
  } catch (e) { }
}
