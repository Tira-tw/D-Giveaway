const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'ping',
    description: 'Bot ping[延遲]',
    run: async (client, interaction) => {
      let pembed = new MessageEmbed()
		  .setColor('#2F3136')	
			.setTitle('Ping')
			.addField('**延遲**', `\`${Date.now() - interaction.createdTimestamp}ms\``)
			.addField('**API延遲**', `\`${Math.round(client.ws.ping)}ms\``)
			.setTimestamp()
			.setFooter(`${interaction.user.username}`, interaction.user.avatarURL());
        interaction.reply({
          embeds: [pembed]
        });
    },
};