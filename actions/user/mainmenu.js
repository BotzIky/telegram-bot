const { Keyboard, Message } = require('../../utils/button');

const messages = {
    id: {
        menu: '📋 Menu Utama\n\nPilih kategori yang tersedia:'
    },
    en: {
        menu: '📋 Main Menu\n\nChoose available category:'
    }
};

module.exports = {
    pattern: 'mainmenu',
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createButton('All', 'menu1'),
                Keyboard.createButton('Group', 'group')
            ),
            Keyboard.row(
                Keyboard.createButton('Channel', 'channel'),
                Keyboard.createButton('Settings', 'settings')
            ),
            Keyboard.row(
                Keyboard.createButton('⬅️ Back', 'start2')
            )
        );

        await Message.edit(ctx, messages[language].menu, keyboard);
    }
};