const { Keyboard, Message } = require('../../utils/button');

const messages = {
    id: {
        title: '🔰 Semua Menu [1/4]\n\nBerikut adalah daftar perintah yang tersedia:',
        commands: [
            '1. /start - Memulai bot'
        ].join('\n')
    },
    en: {
        title: '🔰 All Menu [1/4]\n\nHere are the available commands:',
        commands: [
            '1. /start - Start the bot'
        ].join('\n')
    }
};

module.exports = {
    pattern: 'menu1',
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('⬅️', 'menu4'),
                Keyboard.createButton('🏠', 'start2'),
                Keyboard.createButton('➡️', 'menu2')
            )
        );

        await Message.edit(
            ctx,
            `${messages[language].title}\n\n${messages[language].commands}`,
            keyboard
        );
    }
};