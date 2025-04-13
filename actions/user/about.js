const { Keyboard, Message } = require('../../utils/button');
const config = require('../../config');

const messages = {
    id: {
        about: `ℹ️ Tentang Bot

🤖 Nama Bot: Multi-Purpose Bot
👨‍💻 Dibuat oleh: BotzAku
📅 Versi: 1.0.0

🔥 Fitur Utama:
• Multi-bahasa (ID/EN)
• Sistem Premium
• File Processing
• Dan banyak lagi!

📞 Kontak:
• Telegram: @iky_kiezie
• Email: support@botzaku.eu.org

⚠️ Bot ini masih dalam pengembangan.
Silakan berikan saran dan masukan.`,
    },
    en: {
        about: `ℹ️ About Bot

🤖 Bot Name: Multi-Purpose Bot
👨‍💻 Created by: BotzAku
📅 Version: 1.0.0

🔥 Main Features:
• Multi-language (ID/EN)
• Premium System
• File Processing
• And many more!

📞 Contact:
• Telegram: @iky_kiezie
• Email: support@botzaku.eu.org

⚠️ This bot is still under development.
Please provide suggestions and feedback.`,
    }
};

module.exports = {
    pattern: 'about',
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';

        const keyboard = Keyboard.keyboard(
            Keyboard.row(
                Keyboard.createUrl('📢 Channel', 'https://t.me/BotzAku'),
                Keyboard.createUrl('👥 Group', 'https://t.me/Botz_Aku')
            ),
            Keyboard.row(
                Keyboard.createButton('⬅️ Back', 'start2')
            )
        );

        await Message.edit(ctx, messages[language].about, keyboard);
    }
};