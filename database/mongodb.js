const mongoose = require('mongoose');
const config = require('../config');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    language: String,
    isPremium: { type: Boolean, default: false },
    premiumUntil: Date,
    isBanned: { type: Boolean, default: false },
    dailyLimit: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const mongoDb = {
    async connect() {
        await mongoose.connect(config.database.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    },

    async getUser(userId) {
        return await User.findOne({ id: userId });
    },

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    },

    async updateUser(userId, update) {
        return await User.findOneAndUpdate(
            { id: userId },
            update,
            { new: true }
        );
    },

    async getAllUsers() {
        return await User.find();
    },

    async addPremium(userId, duration) {
        const user = await this.getUser(userId);
        if (!user) return null;

        const now = new Date();
        const currentPremium = user.premiumUntil || now;
        const newPremiumUntil = new Date(
            Math.max(currentPremium.getTime(), now.getTime()) + duration
        );

        return await this.updateUser(userId, {
            isPremium: true,
            premiumUntil: newPremiumUntil
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
        return await User.find().lean();
    },

    async restore(data) {
        await User.deleteMany({});
        await User.insertMany(data);
    },

    async resetDailyLimits() {
        await User.updateMany({}, { dailyLimit: 0 });
    }
};

module.exports = mongoDb;