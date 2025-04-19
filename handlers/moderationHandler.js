const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { SpeechRecognition } = require('discord-speech-recognition');
const Filter = require('bad-words');

class ModerationHandler {
    constructor() {
        this.filter = new Filter();
        this.customBadWords = new Set();
    }

    addBadWord(word) {
        this.customBadWords.add(word.toLowerCase());
    }

    removeBadWord(word) {
        this.customBadWords.delete(word.toLowerCase());
    }

    isInappropriate(text) {
        if (this.filter.isProfane(text)) return true;
        const words = text.toLowerCase().split(' ');
        return words.some(word => this.customBadWords.has(word));
    }

    async handleVoiceModeration(message, text) {
        if (this.isInappropriate(text)) {
            const member = message.member;
            try {
                await member.voice.setMute(true);
                setTimeout(async () => {
                    await member.voice.setMute(false);
                }, 30000); // Unmute after 30 seconds

                const channel = message.guild.channels.cache.find(
                    channel => channel.name === 'mod-logs'
                );
                if (channel) {
                    channel.send(`🔇 Muted ${member.user.tag} for inappropriate language for 30 seconds`);
                }
            } catch (error) {
                console.error('Error muting user:', error);
            }
        }
    }
}

module.exports = new ModerationHandler();