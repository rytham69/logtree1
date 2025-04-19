const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const db = require('../utils/database');

class VoiceStateHandler {
    static createBaseEmbed(member) {
        return new EmbedBuilder()
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            })
            .setTimestamp()
            .setFooter({ text: `User ID: ${member.user.id}` });
    }

    static async handleVoiceStateUpdate(oldState, newState) {
        const logChannel = oldState.guild.channels.cache.find(
            channel => channel.name === config.logChannelName
        );
        if (!logChannel) return;

        const member = oldState.member;
        const logEmbed = this.createBaseEmbed(member);

        // Handle join
        if (!oldState.channelId && newState.channelId) {
            logEmbed
                .setColor(config.embedColors.join)
                .setDescription(`📥 **${member.user.tag}** joined voice channel **${newState.channel.name}**`);
        }
        // Handle leave
        else if (oldState.channelId && !newState.channelId) {
            logEmbed
                .setColor(config.embedColors.leave)
                .setDescription(`📤 **${member.user.tag}** left voice channel **${oldState.channel.name}**`);
        }
        // Handle move
        else if (oldState.channelId !== newState.channelId) {
            logEmbed
                .setColor(config.embedColors.move)
                .setDescription(`↔️ **${member.user.tag}** moved from **${oldState.channel.name}** to **${newState.channel.name}**`);
        }
        // Handle streaming
        else if (oldState.streaming !== newState.streaming) {
            logEmbed
                .setColor(config.embedColors.stream)
                .setDescription(`🎥 **${member.user.tag}** ${newState.streaming ? 'started' : 'stopped'} streaming in **${newState.channel.name}**`);
        }
        // Handle video
        else if (oldState.selfVideo !== newState.selfVideo) {
            logEmbed
                .setColor(config.embedColors.video)
                .setDescription(`📹 **${member.user.tag}** ${newState.selfVideo ? 'started' : 'stopped'} their camera in **${newState.channel.name}**`);
        }

        if (logEmbed.data.description) {
            await logChannel.send({ embeds: [logEmbed] });
        }
    }
}

module.exports = VoiceStateHandler;