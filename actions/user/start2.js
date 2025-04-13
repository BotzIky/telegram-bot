const { Keyboard, Message } = require('../../utils/button');
const config = require('../../config');
const moment = require('moment');

const messages = {
    id: {
        welcome: (user) => `👋 Selamat datang kembali, ${user.firstName}!

📊 Status Akun: ${user.isPremium ? '💎 Premium' : '👤 Regular'}
${user.isPremium ? `📅 Premium sampai: ${moment(user.premiumUntil).format('DD/MM/YYYY')}` : ''}
🎫 Limit Harian: ${user.dailyLimit}/${config.limits.free.dailyLimit}

Silakan pilih menu di bawah ini:`
    },
    en: {
        welcome: (user) => `👋 Welcome back, ${user.firstName}!

📊 Account Status:
${user.isPremium ? '💎 Premium' : '👤 Regular'}
${user.isPremium ? `📅 Premium until: ${moment(user.premiumUntil).format('DD/MM/YYYY')}` : ''}
🎫 Daily Limit: ${user.dailyLimit}/${config.limits.free.dailyLimit}

Please select a menu below:`
    }
};

module.exports = {
    pattern: 'start2',
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const user = ctx.session?.user;
        const mainKeyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('📋 Menu', 'mainmenu'),
                Keyboard.createButton('👤 Profile', 'profile')
            ),
            Keyboard.row(
                Keyboard.createButton('💎 Premium', 'premium'),
                Keyboard.createButton('ℹ️ About', 'about')
            )
        );

        try {
            await Message.edit(
                ctx,
                `${messages[language].welcome(user)}`,
                mainKeyboard
            );
        } catch (error) {
            await Message.send(
                ctx,
                `${messages[language].welcome(user)}`,
                mainKeyboard
            );
        }
    }
};