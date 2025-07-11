require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = require('./load-commands.js').commands;
client.cooldowns = new Collection();

require('./event-handler.js').eventHandler(client);

client.login(discordToken);