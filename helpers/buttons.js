const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createButtons(customOptions = []) {
    const defaultOptions = [
        { id: 'cancel', label: 'Cancel', style: ButtonStyle.Secondary },
        { id: 'confirm', label: 'Confirm', style: ButtonStyle.Danger }
    ];
    const finalOptions = defaultOptions.map((defaultOption, i) => {
        return {
            id: customOptions[i]?.id ?? defaultOption.id,
            label: customOptions[i]?.label ?? defaultOption.label,
            style: customOptions[i]?.style ?? defaultOption.style
        };
    });
    const buttons = finalOptions.map(({ id, label, style }) =>
        new ButtonBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
    );
    return new ActionRowBuilder().addComponents(...buttons);
}

async function handleConfirmation(followUp, id, interaction, message) {
    const collectorFilter = i => i.user.id === id;
    try {
        const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        switch(confirmation.customId) {
            case 'cancel':
                await confirmation.update({
                    content: 'Action cancelled.',
                    components: []
                });
                return false;
            case 'confirm':
                await confirmation.update({
                    content: followUp,
                    components: []
                });
                return true;
            default:
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

async function getMessageConfirmation(prompt, followUp, id, interaction, customOptions = []) {
    const message = await interaction.editReply({
        content: prompt,
        components: [createButtons(customOptions)]
    });
    return handleConfirmation(followUp, id, interaction, message);
}

async function getResponseConfirmation(prompt, followUp, id, interaction, customOptions = []) {
    const response = await interaction.reply({
        content: prompt,
        components: [createButtons(customOptions)],
        withResponse: true
    });
    return handleConfirmation(followUp, id, interaction, response.resource.message);
}

module.exports = { getMessageConfirmation, getResponseConfirmation }