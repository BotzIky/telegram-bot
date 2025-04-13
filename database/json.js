const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

const DB_PATH = path.join(__dirname, 'database.json');
let database = { users: {} };

const jsonDb = {
    async init() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            database = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await this.save();
                console.log('Created new database file');
            } else {
                throw err;
            }
        }
    },

    async save() {
        await fs.writeFile(DB_PATH, JSON.stringify(database, null, 2));
    },

    async getUser(userId) {
        return database.users[userId];
    },

    async createUser(userData) {
        database.users[userData.id] = {
            ...userData,
            isPremium: false,
            premiumUntil: null,
            isBanned: false,
            dailyLimit: 0,
            joinDate: new Date().toISOString()
        };
        await this.save();
        return database.users[userData.id];
    },

    async updateUser(userId, update) {
        database.users[userId] = {
            ...database.users[userId],
            ...update
        };
        await this.save();
        return database.users[userId];
    },

    async getAllUsers() {
        return Object.values(database.users);
    },

    async addPremium(userId, duration) {
        const user = database.users[userId];
        if (!user) return null;

        const now = new Date();
        const currentPremium = user.premiumUntil ? new Date(user.premiumUntil) : now;
        const newPremiumUntil = new Date(
            Math.max(currentPremium.getTime(), now.getTime()) + duration
        );

        return await this.updateUser(userId, {
            isPremium: true,
            premiumUntil: newPremiumUntil.toISOString()
        });
    },

    async removePremium(userId) {
        return await this.updateUser(userId, {
            isPremium: false,
            premiumUntil: null
        });
    },

    async banUser(userId) {
        return await this.updateUser(userId, { isBanned: true });
    },

    async unbanUser(userId) {
        return await this.updateUser(userId, { isBanned: false });
    },

    async backup() {
        return database;
    },

    async restore(data) {
        database = data;
        await this.save();
    },

    async resetDailyLimits() {
        for (const userId in database.users) {
            database.users[userId].dailyLimit = 0;
        }
        await this.save();
    }
};

module.exports = jsonDb;