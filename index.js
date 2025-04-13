const { Telegraf, session } = require('telegraf');
const config = require('./config');
const { loadCommands } = require('./handlers/command');
const { loadActions } = require('./handlers/action');
const { loadEvents } = require('./handlers/event');
const { initDatabase } = require('./database');
const { userCheck } = require('./middleware/userCheck');
const { rateLimit } = require('./middleware/rateLimit');
const { adminMiddleware } = require('./middleware/admin');
const { premiumMiddleware } = require('./middleware/premium');
const { scheduleMiddleware } = require('./middleware/schedule');

async function startBot() {
    try {
        await initDatabase();
        
        const bot = new Telegraf(config.bot.token);

        bot.use(session());
        bot.use(userCheck());
        bot.use(rateLimit());
        bot.use(adminMiddleware());
        bot.use(premiumMiddleware());
        bot.use(scheduleMiddleware(bot));

        loadCommands(bot);
        loadActions(bot);
        loadEvents(bot);

        bot.catch((err, ctx) => {
            console.error('Bot error:', err);
        });

        await bot.launch();
        console.log('Bot is running...');
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();