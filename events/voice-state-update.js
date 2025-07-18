const { Events } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const oldChannelId = oldState.channelId;
        const newChannelId = newState.channelId;
        if (!oldChannelId && newChannelId) {
            newState.client.channels.fetch(newChannelId)
                .then(channel => console.log(`${newState.member.user.displayName} has joined channel ${channel.name}.`))
                .catch(console.error);
        } else if (oldChannelId && !newChannelId) {
            oldState.client.channels.fetch(oldChannelId)
                .then(channel => console.log(`${oldState.member.user.displayName} has left channel ${channel.name}.`))
                .catch(console.error);
        }
    },
};  