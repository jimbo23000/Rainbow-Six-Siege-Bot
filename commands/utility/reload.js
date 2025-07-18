const { MessageFlags, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		let command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply({ 
				content: `Unable to find a command named \`${commandName}\`.`,
				flags: MessageFlags.Ephemeral
			});
		}
		delete require.cache[require.resolve(`./${commandName}.js`)];
		try {
			command = require(`./${commandName}.js`);
			interaction.client.commands.set(commandName, command);
			await interaction.reply(`Successfully reloaded the command \`${commandName}\`.`);
		} catch (error) {
			console.error(`Error reloading the command ${commandName}: ${error.message}.`);
			await interaction.reply({
				content: `Error reloading the command \`${commandName}\`.`,
				flags: MessageFlags.Ephemeral
			});
		}
	},
};