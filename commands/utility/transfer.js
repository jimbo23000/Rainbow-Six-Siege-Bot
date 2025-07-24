const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');
const { getResponseConfirmation } = require('../../helpers/buttons.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription(`Transfers funds to a member's account.`)
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of funds to transfer.')
                .setMinValue(1)
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
                content: `Your account has a balance of $${balance}. Unfortunately you're unable to transfer $${amount} to ${target.displayName}'s account.`,
                flags: MessageFlags.Ephemeral
            });
        }
        const _content1 = `${interaction.user.displayName} would you like to transfer $${amount} to ${target.displayName}'s account?`;
        const _content2 = 'Action confirmed. Proceeding with the transfer...'
        if (!(await getResponseConfirmation(_content1, _content2, interaction.user.id, interaction))) {
            return;
        }
        addBalance(interaction.user.id, -amount);
        console.log(`[transfer] Subtracted $${amount} from ${interaction.user.displayName}'s account.`);
        addBalance(target.id, amount);
        console.log(`[transfer] Added $${amount} to ${target.displayName}'s account.`);
        return interaction.editReply(`Congratulations you've transferred $${amount} to ${target.displayName}'s account.`);
    },
};