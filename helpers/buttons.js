const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createConfirmCancelButtons() {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Danger);
    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
        .addComponents(cancel, confirm);
    return row;
}

async function getMessageConfirmation(_content1, _content2, _id, interaction) {
    const message = await interaction.editReply({
        content: _content1,
        components: [createConfirmCancelButtons()],
    });
    const collectorFilter = i => i.user.id === _id;
    try {
        const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            await confirmation.update({
                content: _content2,
                components: []
            });
            return true;
        } else if (confirmation.customId === 'cancel') {
            await confirmation.update({
                content: 'Action cancelled.',
                components: []
            });
            return false;
        }
    } catch {
        await interaction.editReply({
            content: 'Confirmation not received within 1 minute, cancelling.',
            components: []
        });
        return false;
    }
}

async function getResponseConfirmation(_content1, _content2, _id, interaction) {
    const response = await interaction.reply({
        content: _content1,
        components: [createConfirmCancelButtons()],
        withResponse: true,
    });
    const collectorFilter = i => i.user.id === _id;
    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            await confirmation.update({
                content: _content2,
                components: []
            });
            return true;
        } else if (confirmation.customId === 'cancel') {
            await confirmation.update({
                content: 'Action cancelled.',
                components: []
            });
            return false;
        }
    } catch {
        await interaction.editReply({
            content: 'Confirmation not received within 1 minute, cancelling.',
            components: []
        });
        return false;
    }
}

module.exports = { getMessageConfirmation, getResponseConfirmation }