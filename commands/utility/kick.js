const { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createConfirmCancelButtons } = require('../../helpers/buttons.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Selects a member and kicks them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to kick.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for kicking.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const response = await interaction.reply({
            content: `Are you sure you want to kick ${target.displayName} for reason: \`${reason}\`?`,
            components: [createConfirmCancelButtons()],
            withResponse: true,
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.kick(target);
                await confirmation.update({
                    content: `${target.displayName} has been kicked for reason: \`${reason}\`.`,
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