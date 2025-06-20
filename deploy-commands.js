require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;

const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(discordToken);

const commandsJSONified = require('./fetch-commands.js');

(async () => {
    try {
        console.log(`Started refreshing ${commandsJSONified.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commandsJSONified },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();