const { Events } = require('discord.js');
const { addBalance } = require('../helpers/add-balance');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) {
            return;
        }
	    addBalance(message.author.id, 1);
    }
}