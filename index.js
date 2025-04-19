require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const VoiceStateHandler = require('./handlers/voiceStateHandler');
const CommandHandler = require('./handlers/commandHandler');
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