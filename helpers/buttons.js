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

module.exports = { createConfirmCancelButtons }