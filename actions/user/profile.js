const { Keyboard, Message } = require('../../utils/button');
const config = require('../../config');
const moment = require('moment');

const messages = {
    id: {
        profile: (user) => `👤 Profil Pengguna

🆔 ID: ${user.id}
📝 Nama: ${user.firstName}
${user.username ? `👤 Username: @${user.username}` : ''}
🌍 Bahasa: ${user.language}
📅 Bergabung: ${moment(user.joinDate).format('DD/MM/YYYY')}

📊 Status: ${user.isPremium ? '💎 Premium' : '👤 Regular'}
${user.isPremium ? `📅 Premium sampai: ${moment(user.premiumUntil).format('DD/MM/YYYY')}` : ''}
🎫 Limit Harian: ${user.dailyLimit}/${config.limits.free.dailyLimit}`
    },
    en: {
        profile: (user) => `👤 User Profile

🆔 ID: ${user.id}
📝 Name: ${user.firstName}
${user.username ? `👤 Username: @${user.username}` : ''}
🌍 Language: ${user.language}
📅 Joined: ${moment(user.joinDate).format('DD/MM/YYYY')}

📊 Status: ${user.isPremium ? '💎 Premium' : '👤 Regular'}
${user.isPremium ? `📅 Premium until: ${moment(user.premiumUntil).format('DD/MM/YYYY')}` : ''}
🎫 Daily Limit: ${user.dailyLimit}/${config.limits.free.dailyLimit}`
    }
};

module.exports = {
    pattern: 'profile',
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const user = ctx.session?.user;

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('⬅️ Back', 'start2')
            )
        );

        await Message.edit(ctx, messages[language].profile(user), keyboard);
    }
};