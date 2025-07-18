const { Collection, Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const commandName = interaction.commandName;
        const command = interaction.client.commands.get(commandName);
        if (!command) {
            console.error(`[InteractionCreate] Unable to find a command named ${commandName}.`);
            return;
        }
        if (interaction.isChatInputCommand()) {
            const { cooldowns } = interaction.client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 5;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({
                        content: `Please wait, you're on a cooldown for \`${commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`[InteractionCreate] Error executing the command ${commandName}: ${error.message}.`);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: `Error executing the command \`${commandName}\`.`,
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    await interaction.reply({
                        content: `Error executing the command \`${commandName}\`.`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        } else if (interaction.isAutocomplete()) {
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`[InteractionCreate] Error autocompleting the command ${commandName}: ${error.message}.`);
                return;
            }
        } else if (interaction.isButton()) {

        } else if (interaction.isStringSelectMenu()) {

        }
    },
};