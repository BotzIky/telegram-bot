const { Keyboard, Message } = require('../../utils/button');
const config = require('../../config');

const messages = {
    id: {
        about: `ℹ️ Akan datang...`,
    },
    en: {
        about: `ℹ️ Coming soon...`,
    }
};

module.exports = {
    pattern: 'group',
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