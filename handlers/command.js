const fs = require('fs');
const path = require('path');
const config = require('../config');

function loadCommands(bot) {
    const commandsPath = path.join(__dirname, '../commands');
    const categories = fs.readdirSync(commandsPath);

    categories.forEach(category => {
        const categoryPath = path.join(commandsPath, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const commands = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'));

            commands.forEach(commandFile => {
                const command = require(path.join(categoryPath, commandFile));
                const commandName = commandFile.replace('.js', '');

                if (command.handler) {
                    bot.command(commandName, async (ctx, next) => {
                        try {
                            if (command.admin && !config.bot.admins.includes(ctx.from.id)) {
                                return ctx.reply(config.messages[ctx.session?.language || 'en'].adminOnly);
                            }

                            if (command.premium && !ctx.session?.user?.isPremium) {
                                return ctx.reply(config.messages[ctx.session?.language || 'en'].premiumOnly);
                            }

                            if (command.limit && !ctx.session?.user?.isPremium) {
                                const dailyLimit = ctx.session?.user?.dailyLimit || 0;
                                if (dailyLimit >= config.limits.free.dailyLimit) {
                                    return ctx.reply(config.messages[ctx.session?.language || 'en'].limitReached);
                                }
                                ctx.session.user.dailyLimit = dailyLimit + 1;
                            }

                            await command.handler(ctx, next);
                        } catch (err) {
                            console.error(`Error in command ${commandName}:`, err);
                            ctx.reply('An error occurred while processing your command.');
                        }
                    });
                }
            });
        }
    });
}

module.exports = { loadCommands };