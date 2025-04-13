const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');
const moment = require('moment');

const messages = {
    id: {
        usage: 'Penggunaan: <code>/addpremium [ID User] [Durasi Hari]</code>\nContoh: <code>/addpremium 123456789 30</code>',
        success: (userId, duration) => `✅ Berhasil menambahkan premium untuk user <code>${userId}</code> selama ${duration} hari\nBerlaku hingga: ${moment().add(duration, 'days').format('DD/MM/YYYY HH:mm:ss')}`,
        userNotFound: '❌ User dengan ID tersebut tidak ditemukan dalam database',
        invalidDuration: '❌ Durasi tidak valid. Harap masukkan angka yang lebih besar dari 0',
        notifUser: (duration) => `🌟 Selamat! Anda telah mendapatkan akses premium selama ${duration} hari\nBerlaku hingga: ${moment().add(duration, 'days').format('DD/MM/YYYY HH:mm:ss')}`
    },
    en: {
        usage: 'Usage: <code>/addpremium [User ID] [Duration Days]</code>\nExample: <code>/addpremium 123456789 30</code>',
        success: (userId, duration) => `✅ Successfully added premium for user <code>${userId}</code> for ${duration} days\nValid until: ${moment().add(duration, 'days').format('DD/MM/YYYY HH:mm:ss')}`,
        userNotFound: '❌ User with that ID was not found in database',
        invalidDuration: '❌ Invalid duration. Please enter a number greater than 0',
        notifUser: (duration) => `🌟 Congratulations! You have been granted premium access for ${duration} days\nValid until: ${moment().add(duration, 'days').format('DD/MM/YYYY HH:mm:ss')}`
    }
};

module.exports = {
    admin: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const args = ctx.message.text.split(' ').slice(1);

        if (args.length !== 2) {
            return Message.send(ctx, messages[language].usage);
        }

        const userId = parseInt(args[0]);
        const duration = parseInt(args[1]);

        if (isNaN(duration) || duration <= 0) {
            return Message.send(ctx, messages[language].invalidDuration);
        }

        const user = await db.getUser(userId);
        if (!user) {
            return Message.send(ctx, messages[language].userNotFound);
        }

        await db.addPremium(userId, duration * 24 * 60 * 60 * 1000);

        try {
            await ctx.telegram.sendMessage(userId, messages[language].notifUser(duration));
        } catch (err) {
            console.error('Error sending notification to user:', err);
        }

        return Message.send(ctx, messages[language].success(userId, duration));
    }
};