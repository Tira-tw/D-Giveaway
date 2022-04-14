const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **抽獎** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **抽獎結束** 🎉",
  drawing:  `結束: **{timestamp}**`,
  inviteToParticipate: `點擊 🎉 代表參與活動!`,
  winMessage: "恭喜, {winners}! 你贏了 **{this.prize}**!",
  embedFooter: "Giveaways",
  noWinner: "Giveaway已取消，沒有有效參與。",
  hostedBy: "主辦人: {this.hostedBy}",
  winners: "優勝者(s)",
  endedAt: "結束於"
}