const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../load-database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Retrieves a member\'s inventory.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member\'s inventory to retrieve.'))
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target') ?? interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();
        if (!items.length) {
            return interaction.reply({
                content: `${target.tag} has nothing!`,
                flags: MessageFlags.Ephemeral
            });
        }
        await interaction.reply({
            content: `${target.tag} has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`,
            flags: MessageFlags.Ephemeral
        });
    },
};