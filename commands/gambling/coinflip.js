const { SlashCommandBuilder } = require('discord.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');
const { getMessageConfirmation } = require('../../helpers/buttons.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Coin flips funds against the house or a member.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of funds to wager.')
                .setMinValue(1)
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('side')
                .setDescription('The side of the coin to call.')
                .addChoices(
                    { name: 'Heads', value: 'heads' },
                    { name: 'Tails', value: 'tails' })
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
        const side = interaction.options.getString('side');
        const target = interaction.options.getUser('target');
        if (amount > balance) {
            return interaction.editReply(`Your account has a balance of $${balance}. Unfortunately you're unable to wager $${amount} on ${side} against ${target ? target.displayName : 'the house'}.`);
        }
        let _content1 = `${interaction.user.displayName} would you like to wager $${amount} on ${side} against ${target ? target.displayName : 'the house'}?`;
        const _content2 = 'Action Confirmed. Proceeding with coin flip...'
        if (!(await getMessageConfirmation(_content1, _content2, interaction.user.id, interaction))) {
            return;
        }
        if (target) {
            balance = getBalance(target.id);
            if (amount > balance) {
                return interaction.editReply(`${target.displayName}'s account has a balance of $${balance}. Unfortunately they're unable to wager $${amount} on ${side === 'heads' ? 'tails' : 'heads'} against you.`);
            }
            _content1 = `${target.displayName} would you like to wager $${amount} on ${side === 'heads' ? 'tails' : 'heads'} against ${interaction.user.displayName}?`;
            if (!(await getMessageConfirmation(_content1, _content2, target.id, interaction))) {
                return;
            }
        }
        const result = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';
        if (side === result) {
            addBalance(interaction.user.id, amount);
            console.log(`[coinflip] Added $${amount} to ${interaction.user.displayName}'s account.`);
            if (target) {
                addBalance(target.id, -amount);
                console.log(`[coinflip] Subtracted $${amount} from ${target.displayName}'s account.`);
            }
            return interaction.editReply(`Congratulations ${interaction.user.displayName} you've won $${amount} against ${target ? target.displayName : 'the house'}.`);
        } else {
            addBalance(interaction.user.id, -amount);
            console.log(`[coinflip] Subtracted $${amount} from ${interaction.user.displayName}'s account.`);
            if (target) {
                addBalance(target.id, amount);
                console.log(`[coinflip] Added $${amount} to ${target.displayName}'s account.`);
                return interaction.editReply(`Congratulations ${target.displayName} you've won $${amount} against ${interaction.user.displayName}.`);
            }
            return interaction.editReply(`Unfortunately ${interaction.user.displayName} you've lost $${amount} against the house.`);
        }
    },
};