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
        const target = interaction.options.getUser('target');
        if (target) {
            return interaction.reply(`${target.displayName}'s account has a balance of $${getBalance(target.id)}.`);
        } else {
            return interaction.reply(`Your account has a balance of $${getBalance(interaction.user.id)}.`);
        }
    },
};