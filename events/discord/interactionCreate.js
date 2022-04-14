module.exports = (client, interaction) => {
 // Check if our interaction is a slash command
    if (interaction.isCommand()) {

 // Get the command from our slash command collection
    const command = client.interactions.get(interaction.commandName);

// If command does not exist return an error message
    if (!command) return interaction.reply({
      content: "出了點問題 |也許命令沒有註冊？",
      ephemeral: true
    });

    command.run(client, interaction);
  }
}