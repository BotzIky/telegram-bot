const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');

const messages = {
    id: {
        usage: 'Penggunaan: <code>/ban [ID User]</code>\nContoh: <code>/ban 123456789</code>',
        success: (userId) => `🚫 Berhasil membanned user <code>${userId}</code>`,
        userNotFound: '❌ User dengan ID tersebut tidak ditemukan dalam database',
        notifUser: '🚫 Akun Anda telah dibanned dari menggunakan bot'
    },
    en: {
        usage: 'Usage: <code>/ban [User ID]</code>\nExample: <code>/ban 123456789</code>',
        success: (userId) => `🚫 Successfully banned user <code>${userId}</code>`,
        userNotFound: '❌ User with that ID was not found in database',
        notifUser: '🚫 Your account has been banned from using the bot'
    }
};

module.exports = {
    admin: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const args = ctx.message.text.split(' ').slice(1);

        if (args.length !== 1) {
            return Message.send(ctx, messages[language].usage);
        }

        const userId = parseInt(args[0]);
        const user = await db.getUser(userId);
        
        if (!user) {
            return Message.send(ctx, messages[language].userNotFound);
        }

        await db.banUser(userId);

        try {
            await ctx.telegram.sendMessage(userId, messages[language].notifUser);
        } catch (err) {
            console.error('Error sending notification to user:', err);
        }

        return Message.send(ctx, messages[language].success(userId));
    }
};