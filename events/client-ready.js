const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[ClientReady] Logged in as ${client.user.displayName}.`);
    },
};