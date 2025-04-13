const { Keyboard, Message } = require('../../utils/button');

const messages = {
    id: {
        welcome: (firstName) => `Selamat datang ${firstName}! 👋\nSaya adalah bot yang siap membantu Anda.\n\nSilakan pilih menu di bawah ini:`
    },
    en: {
        welcome: (firstName) => `Welcome ${firstName}! 👋\nI am a bot ready to help you.\n\nPlease choose a menu below:`
    }
};

module.exports = {
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const firstName = ctx.from.first_name;

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('📋 Menu', 'mainmenu'),
                Keyboard.createButton('👤 Profile', 'profile')
            ),
            Keyboard.row(
                Keyboard.createButton('💎 Premium', 'premium'),
                Keyboard.createButton('ℹ️ About', 'about')
            )
        );

        await Message.send(ctx, messages[language].welcome(firstName), keyboard);
    }
};