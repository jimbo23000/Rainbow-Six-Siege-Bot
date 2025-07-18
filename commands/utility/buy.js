const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { CurrencyShop, Users } = require('../../load-database.js');
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
            const formattedItemName = itemName
                .toLowerCase()
                .split(/\s+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return interaction.reply({
                content: `Unfortunately \`${formattedItemName}\` aren't currently in stock at the shop. Check back again later.`,
                flags: MessageFlags.Ephemeral
            });
        }
        const isVowel = /^[aeiou]/i;
        if (item.cost > getBalance(interaction.user.id)) {
            return interaction.reply({
                content: `Your account has a balance of $${getBalance(interaction.user.id)}. Unfortunately you're unable to buy a${isVowel.test(item.name) ? 'n' : ''} ${item.name} for $${item.cost}.`,
                flags: MessageFlags.Ephemeral
            });
        }
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        addBalance(interaction.user.id, -item.cost);
        await user.addItem(item);
        return interaction.reply(`Congratulations you've bought a${isVowel.test(item.name) ? 'n' : ''} ${item.name} for $${item.cost}.`);
    },
};