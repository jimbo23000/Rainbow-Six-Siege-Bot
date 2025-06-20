require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { discordToken } = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(discordToken);