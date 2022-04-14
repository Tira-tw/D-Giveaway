const Discord = require('discord.js'),
  { MessageEmbed } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');
module.exports.run = async (client, message) => {
  const collector = message.channel.createMessageCollector({
    filter: (m) => m.author.id === message.author.id,
    time: 60000,
  });

  let xembed = new MessageEmbed()
  .setTitle("超時！ 🕖")
  .setColor("#FF0000")
  .setDescription('💥 抓住我們的運氣！\n你花了太多時間來決定！\nUse ``create`` 再次開始新的Giveaway！\n嘗試在內部回應 **30秒** 這個時間!')
  .setFooter(client.user.username, client.user.displayAvatarURL())
  .setTimestamp()


  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            message.author.tag + ' | Giveaway 設置',
            message.member.displayAvatarURL()
          )
          .setTitle('Giveaway ' + title)
          .setDescription(desc + ' 在接下來的 60 秒內。')
          .setFooter(
            "Type 'cancel' 退出此過程。",
            client.user.displayAvatarURL()
          )
          .setTimestamp()
          .setColor('#2F3136'),
      ],
    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Prize', '請發送Giveaway獎品');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof MessageEmbed ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'cancel') return await failed('取消贈品Creation.', true);

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            '獎品不能超過 256 個字符。',
            '獎品',
            '請發送Giveaway獎品'
          );
        else {
          prize = m.content;
          await waitingEmbed('Channel', '請發Giveaway頻道');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            '請發送有效的頻道/頻道 ID。',
            '頻道',
            '請發Giveaway頻道'
          );
        else if (!_channel.isText())
          return await failed(
            '頻道必須是文本頻道。',
            '頻道',
            '請發Giveaway頻道'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            '贏家數',
            '請發送Giveaway獲獎者人數。'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            '獲勝者的數量必須是整數。',

            '贏家數',
            '請發送Giveaway獲獎者人數。'
          );
        if (_w < 1)
          return await failed(
            '獲勝者數必須大於 1。',
            '贏家數',
            '請發送Giveaway獲獎者人數。'
          );
        else if (_w > 15)
          return await failed(
            '獲勝者人數必須少於 15。',
            '贏家數',
            '請發送Giveaway獲獎者人數。'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('期間', '請發送Giveaway持續時間');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            '請提供有效的持續時間。',
            '期間',
            '請發送Giveaway持續時間'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            '持續時間必須少於 21 天！',
            '期間',
            '請發送Giveaway持續時間'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          messages,
          hostedBy: client.config.hostedBy && message.author,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};
