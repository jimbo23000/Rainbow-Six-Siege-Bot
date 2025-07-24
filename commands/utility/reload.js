const { MessageFlags, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

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
		const commandsPath = path.join(__dirname, '..');
		let commandFile = null;
		const folders = fs.readdirSync(commandsPath, { withFileTypes: true });
		for (const folder of folders) {
			if (!folder.isDirectory()) {
				continue;
			}
			const folderPath = path.join(commandsPath, folder.name);
			const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
			for (const file of files) {
				if (file === `${commandName}.js`) {
					commandFile = path.join(folderPath, file);
					break;
				}
			}
			if (commandFile) {
				break;
			}
		}
		try {
			delete require.cache[require.resolve(commandFile)];
			command = require(commandFile);
			interaction.client.commands.set(commandName, command);
			return interaction.reply(`Successfully reloaded the command \`${commandName}\`.`);
		} catch (error) {
			console.error(`Error reloading the command ${commandName}: ${error.message}`);
			return interaction.reply({
				content: `Error reloading the command \`${commandName}\`.`,
				flags: MessageFlags.Ephemeral
			});
		}
	},
};