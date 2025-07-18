const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionContextType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to ban.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger);
        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);
        const response = await interaction.reply({
            content: `Are you sure you want to ban ${target.displayName} for reason: \`${reason}\`?`,
            components: [row],
            withResponse: true,
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.ban(target);
                await confirmation.update({
                    content: `${target.displayName} has been banned for reason: \`${reason}\`.`,
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({
                    content: 'Action cancelled.',
                    components: []
                });
            }
        } catch {
            await interaction.editReply({
                content: 'Confirmation not received within 1 minute, cancelling.',
                components: []
            });
        }
    },
};