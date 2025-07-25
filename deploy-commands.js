require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;
const serverId = process.env.SERVER_ID;

const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(discordToken);

const { commandsJSONified } = require('./load-commands.js');
(async () => {
    try {
        console.log(`Started reloading ${commandsJSONified.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(applicationId, serverId),
            { body: commandsJSONified },
        );
        /*
        // Code for global deployment
        const data = await rest.put(
            Routes.applicationCommands(applicationId),
            { body: commandsJSONified },
        );
        */
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(`Error reloading application (/) commands: ${error.message}`);
    }
})();