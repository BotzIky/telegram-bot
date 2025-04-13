const { Keyboard, Message } = require('../../utils/button');
const config = require('../../config');

const messages = {
    id: {
        about: `📋 Menu Premium\n\nPilih perintah yang tersedia:`,
    },
    en: {
        about: `📋 Main Premium\n\nChoose available commands:`,
    }
};

module.exports = {
    pattern: 'premium',
    premium: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('⬅️ Back', 'mainmenu')
            )
        );

        await Message.edit(ctx, messages[language].about, keyboard);
    }
};