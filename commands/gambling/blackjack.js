const { SlashCommandBuilder } = require('discord.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');
const { getMessageConfirmation } = require('../../helpers/buttons.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Gambles funds in a round of blackjack against the house.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of funds to wager.')
                .setMinValue(1)
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription(`The member to wager against.`)
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();
        let balance = getBalance(interaction.user.id);
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        if (amount > balance) {
            return interaction.editReply(`Your account has a balance of $${balance}. Unfortunately you're unable to wager $${amount} in a round of blackjack against ${target ? target.displayName : 'the house'}.`);
        }
        let prompt = `${interaction.user.displayName} would you like to wager $${amount} in a round of blackjack against ${target ? target.displayName : 'the house'}?`;
        const followUp = 'Action Confirmed. Proceeding with the round of blackjack...'
        if (!(await getMessageConfirmation(prompt, followUp, interaction.user.id, interaction))) {
            return;
        }
        if (target) {
            balance = getBalance(target.id);
            if (amount > balance) {
                return interaction.editReply(`${target.displayName}'s account has a balance of $${balance}. Unfortunately they're unable to wager $${amount} in a round of blackjack against you.`);
            }
            prompt = `${target.displayName} would you like to wager $${amount} in a round of blackjack against ${interaction.user.displayName}?`;
            if (!(await getMessageConfirmation(prompt, followUp, target.id, interaction))) {
                return;
            }
        }
    },
};