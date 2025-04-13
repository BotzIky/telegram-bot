const cron = require('node-cron');
const { db } = require('../database');
const config = require('../config');
const fs = require('fs').promises;
const path = require('path');

async function ensureBackupDir() {
    const backupDir = path.join(__dirname, '../database/backup');
    try {
        await fs.access(backupDir);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(backupDir, { recursive: true });
            console.log('Backup directory created');
        } else {
            throw error;
        }
    }
    return backupDir;
}

async function createBackup(bot) {
    try {
        const backupData = await db.backup();
        const backupDir = await ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
        const latestBackupPath = path.join(backupDir, 'latest-backup.json');

        await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
        await fs.writeFile(latestBackupPath, JSON.stringify(backupData, null, 2));

        const backupFile = {
            source: Buffer.from(JSON.stringify(backupData, null, 2)),
            filename: `backup-${timestamp}.json`
        };

        if (config.ch.name) {
            await bot.telegram.sendDocument(config.ch.name, backupFile);
        }

        const files = await fs.readdir(backupDir);
        const backupFiles = files.filter(file => file.startsWith('backup-'));

        if (backupFiles.length > 10) {
            const oldestFiles = backupFiles
                .map(file => ({ name: file, time: fs.statSync(path.join(backupDir, file)).mtime }))
                .sort((a, b) => a.time - b.time)
                .slice(0, backupFiles.length - 10);

            for (const file of oldestFiles) {
                await fs.unlink(path.join(backupDir, file.name));
            }
        }

        console.log(`Automated backup completed: ${backupPath}`);
    } catch (err) {
        console.error('Automated backup error:', err);
    }
}

function scheduleMiddleware(bot) {
    const backupSchedule = cron.schedule('0 */6 * * *', async () => {
        await createBackup(bot);
    });

    const resetLimitSchedule = cron.schedule('0 0 * * *', async () => {
        try {
            await db.resetDailyLimits();
            console.log('Daily limits reset completed');
        } catch (err) {
            console.error('Reset daily limits error:', err);
        }
    });

    const checkPremiumSchedule = cron.schedule('0 * * * *', async () => {
        try {
            const users = await db.getAllUsers();
            const now = new Date();

            for (const user of users) {
                if (user.isPremium && user.premiumUntil) {
                    const premiumUntil = new Date(user.premiumUntil);
                    if (premiumUntil <= now) {
                        await db.removePremium(user.id);
                        try {
                            await bot.telegram.sendMessage(
                                user.id,
                                `Your premium subscription has expired.`
                            );
                        } catch (err) {
                            console.error('Failed to send premium expiration message:', err);
                        }
                    }
                }
            }
            console.log('Premium check completed');
        } catch (err) {
            console.error('Premium check error:', err);
        }
    });

    process.on('SIGINT', () => {
        backupSchedule.stop();
        resetLimitSchedule.stop();
        checkPremiumSchedule.stop();
    });

    process.on('SIGTERM', () => {
        backupSchedule.stop();
        resetLimitSchedule.stop();
        checkPremiumSchedule.stop();
    });

    return async (ctx, next) => {
        return next();
    };
}

module.exports = { scheduleMiddleware };