require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;
const serverId = process.env.SERVER_ID;

const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(discordToken);

const args = process.argv;
if (args.length > 2) {
    rest.delete(Routes.applicationGuildCommand(applicationId, serverId, args[2]))
        .then(() => console.log('Successfully deleted guild command.'))
        .catch(console.error);
    /*
    // Code for global deletion
    rest.delete(Routes.applicationCommand(applicationId, 'commandId'))
        .then(() => console.log('Successfully deleted application command.'))
        .catch(console.error);
    */
} else {
    rest.put(Routes.applicationGuildCommands(applicationId, serverId), { body: [] })
        .then(() => console.log('Successfully deleted all guild commands.'))
        .catch(console.error);
    /*
    // Code for global deletion
    rest.put(Routes.applicationCommands(applicationId), { body: [] })
        .then(() => console.log('Successfully deleted all application commands.'))
        .catch(console.error);
    */
}