const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');

const messages = {
    id: {
        usage: 'Penggunaan: <code>/delpremium [ID User]</code>\nContoh: <code>/delpremium 123456789</code>',
        success: (userId) => `✅ Berhasil menghapus premium untuk user <code>${userId}</code>`,
        userNotFound: '❌ User dengan ID tersebut tidak ditemukan dalam database',
        notifUser: '⚠️ Status premium Anda telah dihapus'
    },
    en: {
        usage: 'Usage: <code>/delpremium [User ID]</code>\nExample: <code>/delpremium 123456789</code>',
        success: (userId) => `✅ Successfully removed premium for user <code>${userId}</code>`,
        userNotFound: '❌ User with that ID was not found in database',
        notifUser: '⚠️ Your premium status has been removed'
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

        await db.removePremium(userId);

        try {
            await ctx.telegram.sendMessage(userId, messages[language].notifUser);
        } catch (err) {
            console.error('Error sending notification to user:', err);
        }

        return Message.send(ctx, messages[language].success(userId));
    }
};