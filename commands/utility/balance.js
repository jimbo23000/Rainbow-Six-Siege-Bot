const { InteractionContextType, SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../../helpers/balances.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription(`Retrieves a member's account balance.`)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription(`The member's account balance to retrieve.`))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target') ?? interaction.user;
        const isUser = interaction.user.id === target.id;
        return interaction.reply(`${isUser ? 'Your' : `${target.displayName}'s`} account has a balance of $${getBalance(target.id)}.`);
    },
};