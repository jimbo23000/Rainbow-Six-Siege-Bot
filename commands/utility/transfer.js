const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfers funds to a member\'s account.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of funds to transfer.')
                .setMinValue(0)
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member\'s account to transfer funds to.')
                .setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const balance = getBalance(interaction.user.id);
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        if (amount > balance) {
            return interaction.reply({
                content: `${interaction.user}\'s account has insufficient funds, unable to transfer $${amount}.`,
                flags: MessageFlags.Ephemeral
            });
        }
        addBalance(interaction.user.id, -amount);
        addBalance(target.id, amount);
        return interaction.reply(`${interaction.user} has transferred $${amount} to ${target.tag}\'s account.`);
    },
};