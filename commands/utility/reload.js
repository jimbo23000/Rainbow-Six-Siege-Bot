const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
		const command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply(`Unable to find a command named \`${commandName}\`.`);
		}
		delete require.cache[require.resolve(`./${command.data.name}.js`)];
		try {
			const newCommand = require(`./${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Successfully reloaded the command \`${newCommand.data.name}\`.`);
		} catch (error) {
			console.error(error);
			await interaction.reply(`Error reloading the command \`${command.data.name}\`.`);
		}
	},
};