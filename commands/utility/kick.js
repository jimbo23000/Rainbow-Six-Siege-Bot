const { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getResponseConfirmation } = require('../../helpers/buttons.js');

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
        const _content1 = `Are you sure you want to kick ${target.displayName} for reason: \`${reason}\`?`;
        const _content2 = `${target.displayName} has been kicked for reason: \`${reason}\`.`;
        if (await getResponseConfirmation(_content1, _content2, interaction.user.id, interaction)) {
            return interaction.guild.members.kick(target);
        }
    },
};