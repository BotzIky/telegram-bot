const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');

const messages = {
    id: {
        usage: 'Penggunaan: <code>/broadcast [Pesan]</code>\n' +
            'Contoh: <code>/broadcast Halo semua!</code>\n' +
            'Untuk menambahkan tombol: <code>/broadcast Pesan\nTeks Tombol|Link</code>\n\n' +
            'Format tersedia:\n' +
            '• HTML: <code>&lt;b&gt;tebal&lt;/b&gt;, &lt;i&gt;miring&lt;/i&gt;, &lt;code&gt;kode&lt;/code&gt;</code>\n' +
            '• Markdown: <code>**tebal**, *miring*, `kode`</code>\n' +
            'Untuk menggunakan Markdown, tambahkan "md:" di awal pesan',
        started: '📣 Memulai broadcast...',
        progress: (current, total, success, failed, blocked) => 
            `📤 Proses Broadcast\n` +
            `⏳ Progress: ${current}/${total} (${Math.round((current/total) * 100)}%)\n` +
            `✅ Berhasil: ${success}\n` +
            `❌ Gagal: ${failed}\n` +
            `🚫 Diblokir: ${blocked}`,
        completed: (success, failed, blocked) => 
            `✅ Broadcast selesai\n\n` +
            `📊 Statistik:\n` +
            `✓ Berhasil: ${success}\n` +
            `× Gagal: ${failed}\n` +
            `🚫 Diblokir: ${blocked}`,
        noMessage: '❌ Mohon masukkan pesan yang akan di-broadcast'
    },
    en: {
        usage: 'Usage: <code>/broadcast [Message]</code>\n' +
            'Example: <code>/broadcast Hello everyone!</code>\n' +
            'To add buttons: <code>/broadcast Message\nButton Text|Link</code>\n\n' +
            'Available formats:\n' +
            '• HTML: <code>&lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;code&gt;code&lt;/code&gt;</code>\n' +
            '• Markdown: <code>**bold**, *italic*, `code`</code>\n' +
            'To use Markdown, add "md:" at the beginning of the message',
        started: '📣 Starting broadcast...',
        progress: (current, total, success, failed, blocked) => 
            `📤 Broadcasting Progress\n` +
            `⏳ Progress: ${current}/${total} (${Math.round((current/total) * 100)}%)\n` +
            `✅ Success: ${success}\n` +
            `❌ Failed: ${failed}\n` +
            `🚫 Blocked: ${blocked}`,
        completed: (success, failed, blocked) => 
            `✅ Broadcast completed\n\n` +
            `📊 Statistics:\n` +
            `✓ Success: ${success}\n` +
            `× Failed: ${failed}\n` +
            `🚫 Blocked: ${blocked}`,
        noMessage: '❌ Please enter the message to broadcast'
    }
};

function parseMessageAndButtons(text) {
    const parts = text.split('\n');
    const message = [];
    const buttons = [];
    let isMarkdown = false;
    
    if (parts[0].toLowerCase().startsWith('md:')) {
        isMarkdown = true;
        parts[0] = parts[0].substring(3).trim(); 
    }

    for (const part of parts) {
        if (part.includes('|')) {
            const [buttonText, buttonUrl] = part.split('|');
            if (buttonText && buttonUrl) {
                buttons.push(Keyboard.createUrl(buttonText.trim(), buttonUrl.trim()));
            }
        } else {
            message.push(part);
        }
    }

    return {
        message: message.join('\n'),
        buttons: buttons.length > 0 ? Keyboard.keyboard(buttons) : null,
        isMarkdown
    };
}

module.exports = {
    admin: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        const messageText = ctx.message.text.split(' ').slice(1).join(' ');

        if (!messageText) {
            return Message.send(ctx, messages[language].usage);
        }

        const { message, buttons, isMarkdown } = parseMessageAndButtons(messageText);
        const statusMessage = await Message.send(ctx, messages[language].started);
        const users = await db.getAllUsers();
        const total = users.length;
        let success = 0;
        let failed = 0;
        let blocked = 0;
        let lastUpdateTime = Date.now();

        const messageOptions = {
            parse_mode: isMarkdown ? 'Markdown' : 'HTML',
            ...(buttons && buttons)
        };

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            try {
                await ctx.telegram.sendMessage(
                    user.id, 
                    message,
                    messageOptions
                );
                success++;
            } catch (err) {
                console.error(`Broadcast failed for user ${user.id}:`, err);
                
                if (err.description && err.description.includes('parse')) {
                    try {
                        await ctx.telegram.sendMessage(
                            user.id,
                            message,
                            {
                                parse_mode: undefined,
                                ...(buttons && buttons)
                            }
                        );
                        success++;
                        continue;
                    } catch (plainTextErr) {
                        console.error(`Plain text broadcast failed for user ${user.id}:`, plainTextErr);
                    }
                }
                
                if (err.description && (
                    err.description.includes('blocked') ||
                    err.description.includes('bot was blocked') ||
                    err.description.includes('user is deactivated')
                )) {
                    blocked++;
                } else {
                    failed++;
                }
            }

            const currentTime = Date.now();
            if (i % 10 === 0 || currentTime - lastUpdateTime >= 2000) {
                try {
                    await Message.edit(
                        ctx,
                        messages[language].progress(i + 1, total, success, failed, blocked),
                        { chat_id: ctx.chat.id, message_id: statusMessage.message_id }
                    );
                    lastUpdateTime = currentTime;
                } catch (err) {
                    console.error('Error updating progress:', err);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await Message.edit(
            ctx,
            messages[language].completed(success, failed, blocked),
            { chat_id: ctx.chat.id, message_id: statusMessage.message_id }
        );
    }
};