const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Client ready! Logged in as ${client.user.tag}.`);
    },
};