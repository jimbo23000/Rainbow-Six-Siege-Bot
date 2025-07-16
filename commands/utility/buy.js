const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { Users, CurrencyShop } = require('../../load-database.js');
const { addBalance, getBalance } = require('../../helpers/balances.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buys an item from the shop.')
        .addStringOption(option =>
            option
                .setName('item')
                .setDescription('The item to buy from the shop.')
                .setAutocomplete(true)
                .setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = await CurrencyShop.findAll({
            attributes: ['name'],
        }).then(items => items.map(item => item.name));
        const filteredChoices = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(filteredChoices.map(choice => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const { Op } = require('sequelize');
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
        if (!item) {
            return interaction.reply({
                content: `That item doesn't appear to be in stock at the shop. Check back again later.`,
                flags: MessageFlags.Ephemeral
            });
        }
        if (item.cost > getBalance(interaction.user.id)) {
            return interaction.reply({
                content: `Your account has a balance of $${getBalance(interaction.user.id)}. You're unable to buy a[n] ${item.name} for $${item.cost}.`,
                flags: MessageFlags.Ephemeral
            });
        }
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        addBalance(interaction.user.id, -item.cost);
        await user.addItem(item);
        return interaction.reply(`You've bought a[n] ${item.name} for $${item.cost}.`);
    },
};