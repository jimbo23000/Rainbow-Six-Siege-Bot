const { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getResponseConfirmation } = require('../../helpers/buttons.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Selects a member and bans them.')
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
        const _content1 = `Are you sure you want to ban ${target.displayName} for reason: \`${reason}\`?`;
        const _content2 = `${target.displayName} has been banned for reason: \`${reason}\`.`;
        if (await getResponseConfirmation(_content1, _content2, interaction.user.id, interaction)) {
            return interaction.guild.members.ban(target);
        }
    },
};