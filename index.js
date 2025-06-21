require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = require('./load-commands.js').commands;

require('./event-handler.js').eventHandler(client);

client.login(discordToken);