require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { addSpeechEvent } = require('discord-speech-recognition');
const VoiceStateHandler = require('./handlers/voiceStateHandler');
const CommandHandler = require('./handlers/commandHandler');
const ModerationHandler = require('./handlers/moderationHandler');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Add speech recognition
addSpeechEvent(client);

// Handle speech recognition
client.on('speech', async (message) => {
    if (message.content) {
        await ModerationHandler.handleVoiceModeration(message, message.content);
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    await VoiceStateHandler.handleVoiceStateUpdate(oldState, newState);
});

client.on('messageCreate', async (message) => {
    await CommandHandler.handleCommand(message);
});

client.login(process.env.TOKEN);