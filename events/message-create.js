const { Events } = require('discord.js');
const { addBalance } = require('../helpers/balances.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) {
            return;
        }
	    addBalance(message.author.id, 1);
        console.log(`[MessageCreate] Added $1 to ${message.author.displayName}'s account.`);
    },
};