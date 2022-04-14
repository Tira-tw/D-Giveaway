const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member, reaction){
     reaction.users.remove(member.user);
  member.send(`**哦，快！看起來Giveaway已經結束了！**`).catch(e => {})
  }
}