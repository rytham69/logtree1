const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const db = require('../utils/database');

class CommandHandler {
    static async handleCommand(message) {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'stats':
                await this.handleStats(message, args);
                break;
            case 'help':
                await this.handleHelp(message);
                break;
            case 'ping':
                await this.handlePing(message);
                break;
            case 'serverinfo':
                await this.handleServerInfo(message);
                break;
            case 'userinfo':
                await this.handleUserInfo(message, args);
                break;
        }
    }

    static async handleStats(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Voice Channel Statistics')
            .setDescription('Statistics are being tracked...')
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    static async handleHelp(message) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Commands')
            .setDescription('Here are all available commands:')
            .addFields(
                { name: '!stats', value: 'View voice channel statistics' },
                { name: '!help', value: 'Show this help message' },
                { name: '!ping', value: 'Check bot latency' },
                { name: '!serverinfo', value: 'Display server information' },
                { name: '!userinfo [@user]', value: 'Display user information' }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    static async handlePing(message) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏓 Pong!')
            .setDescription(`Latency: ${message.client.ws.ping}ms`)
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    static async handleServerInfo(message) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                { name: 'Members', value: `${message.guild.memberCount}`, inline: true },
                { name: 'Created At', value: message.guild.createdAt.toLocaleDateString(), inline: true },
                { name: 'Server ID', value: message.guild.id, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    static async handleUserInfo(message, args) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`User Information - ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Joined Server', value: member.joinedAt.toLocaleDateString(), inline: true },
                { name: 'Account Created', value: member.user.createdAt.toLocaleDateString(), inline: true },
                { name: 'User ID', value: member.user.id, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    // Inside CommandHandler class, add these methods:
    static async handleAddBadWord(message, args) {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) return;
        const word = args[0];
        if (!word) {
            await message.reply('Please provide a word to add to the filter.');
            return;
        }
        ModerationHandler.addBadWord(word);
        await message.reply(`Added "${word}" to the filter.`);
    }

    static async handleRemoveBadWord(message, args) {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) return;
        const word = args[0];
        if (!word) {
            await message.reply('Please provide a word to remove from the filter.');
            return;
        }
        ModerationHandler.removeBadWord(word);
        await message.reply(`Removed "${word}" from the filter.`);
    }
}

module.exports = CommandHandler;