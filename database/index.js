const config = require('../config');
const jsonDb = require('./json');
const mongoDb = require('./mongodb');

let db;

async function initDatabase() {
    if (config.database.useMongoDb) {
        await mongoDb.connect();
        db = mongoDb;
    } else {
        await jsonDb.init();
        db = jsonDb;
    }
    console.log(`Using ${config.database.useMongoDb ? 'MongoDB' : 'JSON'} database`);
}

module.exports = {
    initDatabase,
    db: {
        async getUser(userId) {
            return await db.getUser(userId);
        },
        async createUser(userData) {
            return await db.createUser(userData);
        },
        async updateUser(userId, update) {
            return await db.updateUser(userId, update);
        },
        async getAllUsers() {
            return await db.getAllUsers();
        },
        
        async addPremium(userId, duration) {
            return await db.addPremium(userId, duration);
        },
        async removePremium(userId) {
            return await db.removePremium(userId);
        },
        
        async banUser(userId) {
            return await db.banUser(userId);
        },
        async unbanUser(userId) {
            return await db.unbanUser(userId);
        },
        
        async backup() {
            return await db.backup();
        },
        async restore(data) {
            return await db.restore(data);
        },
        
        async resetDailyLimits() {
            return await db.resetDailyLimits();
        }
    }
};