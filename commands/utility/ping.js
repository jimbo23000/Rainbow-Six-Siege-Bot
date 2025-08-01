const { MessageFlags, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        return interaction.reply({
            content: 'Pong!',
            flags: MessageFlags.Ephemeral
        })
    },
};