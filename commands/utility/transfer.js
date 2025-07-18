const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription(`Transfers funds to a member's account.`)
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of funds to transfer.')
                .setMinValue(0)
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription(`The member's account to transfer funds to.`)
                .setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const balance = getBalance(interaction.user.id);
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        if (amount > balance) {
            return interaction.reply({
                content: `Your account has a balance of $${getBalance(interaction.user.id)}. Unfortunately you're unable to transfer $${amount} to ${target.displayName}'s account.`,
                flags: MessageFlags.Ephemeral
            });
        }
        addBalance(interaction.user.id, -amount);
        addBalance(target.id, amount);
        return interaction.reply(`Congratulations you've transferred $${amount} to ${target.displayName}'s account.`);
    },
};