const fs = require('node:fs');
const path = require('node:path');
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const { Collection } = require('discord.js');
const commands = new Collection();
const commandsJSONified = [];
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
            commandsJSONified.push(command.data.toJSON());
        } else {
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

module.exports = { commands, commandsJSONified};