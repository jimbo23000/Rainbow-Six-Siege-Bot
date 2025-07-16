const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../load-database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription(`Retrieves a member's inventory.`)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription(`The member's inventory to retrieve.`))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target') ?? interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });
        if (!user) {
            return interaction.reply({
                content: `${target.tag} has nothing in their inventory.`,
                flags: MessageFlags.Ephemeral
            });
        }
        const items = await user.getItems();
        if (!items || !items.length) {
            return interaction.reply({
                content: `${target.tag} has nothing in their inventory.`,
                flags: MessageFlags.Ephemeral
            });
        }
        await interaction.reply(`${target.tag} has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')} in their inventory.`);
    },
};