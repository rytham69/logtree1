const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database('voiceStats.db');
        this.init();
    }

    init() {
        this.db.serialize(() => {
            // Voice sessions table
            this.db.run(`CREATE TABLE IF NOT EXISTS voice_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                channel_id TEXT,
                guild_id TEXT,
                start_time DATETIME,
                end_time DATETIME,
                duration INTEGER,
                activity_type TEXT
            )`);

            // Daily statistics table
            this.db.run(`CREATE TABLE IF NOT EXISTS daily_stats (
                date TEXT,
                guild_id TEXT,
                channel_id TEXT,
                total_users INTEGER,
                total_duration INTEGER,
                PRIMARY KEY (date, guild_id, channel_id)
            )`);

            // User statistics table
            this.db.run(`CREATE TABLE IF NOT EXISTS user_stats (
                user_id TEXT,
                guild_id TEXT,
                total_time INTEGER,
                last_seen DATETIME,
                PRIMARY KEY (user_id, guild_id)
            )`);
        });
    }

    // Add your database methods here
    async addSession(userId, channelId, guildId) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO voice_sessions (user_id, channel_id, guild_id, start_time, activity_type) 
                        VALUES (?, ?, ?, datetime('now'), 'voice')`,
                [userId, channelId, guildId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    }

    // Add more database methods...
}

module.exports = new Database();