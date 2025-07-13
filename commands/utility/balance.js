const { MessageFlags, InteractionContextType, SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../../helpers/balances.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Retrieves a member\'s balance.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member\'s balance to retrieve.'))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target') ?? interaction.user;
        await interaction.reply({ content: `${target.tag} has $${getBalance(target.id)}.`, flags: MessageFlags.Ephemeral });
    },
};