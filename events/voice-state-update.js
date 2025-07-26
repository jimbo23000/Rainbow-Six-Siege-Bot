const { Events, time } = require('discord.js');
const { addBalance } = require('../helpers/balances.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const oldChannelId = oldState.channelId;
        const newChannelId = newState.channelId;
        const now = Date.now();
        if (!oldChannelId && newChannelId) {
            const { timestamps } = newState.client;
            timestamps.set(newState.member.user.id, now);
            newState.client.channels.fetch(newChannelId)
                .then(channel => console.log(`${newState.member.user.displayName} has joined channel ${channel.name} at ${new Date(now)}.`))
                .catch(console.error);
        } else if (oldChannelId && !newChannelId) {
            const { timestamps } = oldState.client;
            if (!timestamps.get(oldState.member.user.id)) {
                console.log(`[VoiceStatusUpdate] Unable to find a timestamp for ${oldState.member.user.displayName}.`);
                return;
            }
            const amount = Math.floor((now - timestamps.get(oldState.member.user.id)) / 60_000);
            addBalance(oldState.member.user.id, amount);
            console.log(`[VoiceStatusUpdate] Added $${amount} to ${oldState.member.user.displayName}'s account.`);
            timestamps.delete(oldState.member.user.id);
            oldState.client.channels.fetch(oldChannelId)
                .then(channel => console.log(`${oldState.member.user.displayName} has left channel ${channel.name} at ${new Date(now)}.`))
                .catch(console.error);
        }
    },
};  