const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');
const config = require('../../config');

const messages = {
    id: {
        usage: 'Penggunaan:\n1. Kirim file backup.json\n2. Atau kirim teks JSON untuk restore\n3. Atau ketik <code>/restore [JSON Data]</code>',
        success: '✅ Database berhasil direstore',
        error: '❌ Terjadi kesalahan saat restore database',
        invalidFormat: '❌ Format data tidak valid',
        noData: '❌ Tidak ada file atau data yang dikirim',
        invalidFile: '❌ File yang dikirim bukan file JSON'
    },
    en: {
        usage: 'Usage:\n1. Send backup.json file\n2. Or send JSON text to restore\n3. Or type <code>/restore [JSON Data]</code>',
        success: '✅ Database restored successfully',
        error: '❌ Error occurred while restoring database',
        invalidFormat: '❌ Invalid data format',
        noData: '❌ No file or data was sent',
        invalidFile: '❌ Sent file is not a JSON file'
    }
};

module.exports = {
    admin: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';

        try {
            let data;

            const replyToMessage = ctx.message.reply_to_message;
            const caption = ctx.message.caption;
            
            if (replyToMessage && replyToMessage.document) {
                if (!replyToMessage.document.file_name.toLowerCase().endsWith('.json')) {
                    return Message.send(ctx, messages[language].invalidFile);
                }
                const file = await ctx.telegram.getFile(replyToMessage.document.file_id);
                const response = await fetch('https://api.telegram.org/file/bot' + config.bot.token + '/' + file.file_path);
                const text = await response.text();
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    return Message.send(ctx, messages[language].invalidFormat);
                }
            }
            else if (ctx.message.document) {
                if (!ctx.message.document.file_name.toLowerCase().endsWith('.json')) {
                    return Message.send(ctx, messages[language].invalidFile);
                }
                if (caption && caption.startsWith('/restore')) {
                    const file = await ctx.telegram.getFile(ctx.message.document.file_id);
                    const response = await fetch('https://api.telegram.org/file/bot' + config.bot.token + '/' + file.file_path);
                    const text = await response.text();
                    try {
                        data = JSON.parse(text);
                    } catch (err) {
                        return Message.send(ctx, messages[language].invalidFormat);
                    }
                } else {
                    return Message.send(ctx, messages[language].usage);
                }
            }
            else if (ctx.message.text) {
                const text = ctx.message.text.replace(/^\/restore\s*/, '').trim();
                if (!text) {
                    return Message.send(ctx, messages[language].usage);
                }
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    return Message.send(ctx, messages[language].invalidFormat);
                }
            }
            else {
                return Message.send(ctx, messages[language].usage);
            }

            if (!data) {
                return Message.send(ctx, messages[language].noData);
            }

            await db.restore(data);
            return Message.send(ctx, messages[language].success);
        } catch (err) {
            console.error('Restore error:', err);
            return Message.send(ctx, messages[language].error);
        }
    }
};