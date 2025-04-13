const { Keyboard, Message } = require('../../utils/button');
const { db } = require('../../database');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

const messages = {
    id: {
        success: '✅ Backup database berhasil',
        error: '❌ Terjadi kesalahan saat backup database'
    },
    en: {
        success: '✅ Database backup successful',
        error: '❌ Error occurred while backing up database'
    }
};

module.exports = {
    admin: true,
    handler: async (ctx) => {
        const language = ctx.session?.language || 'en';
        
        try {
            const backupData = await db.backup();
            const backupDir = path.join(__dirname, '../../database/backup');
            const backupPath = path.join(backupDir, 'backup.json');

            try {
                await fs.mkdir(backupDir, { recursive: true });
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }

            await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));

            const backupFile = {
                source: Buffer.from(JSON.stringify(backupData, null, 2)),
                filename: 'backup.json'
            };

            if (config.ch.name) {
                await ctx.telegram.sendDocument(config.ch.name, backupFile);
            }

            return Message.send(ctx, messages[language].success);
        } catch (err) {
            console.error('Backup error:', err);
            return Message.send(ctx, messages[language].error);
        }
    }
};