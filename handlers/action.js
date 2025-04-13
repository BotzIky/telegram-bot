const fs = require('fs');
const path = require('path');
const config = require('../config');

function loadActions(bot) {
    const actionsPath = path.join(__dirname, '../actions');
    const categories = fs.readdirSync(actionsPath);

    categories.forEach(category => {
        const categoryPath = path.join(actionsPath, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const actions = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'));

            actions.forEach(actionFile => {
                const action = require(path.join(categoryPath, actionFile));
  
                const actionPattern = action.pattern || 
                    `^${actionFile.replace('.js', '')}$`;

                if (action.handler) {
                    bot.action(new RegExp(actionPattern), async (ctx, next) => {
                        try {
                            if (action.admin && !config.bot.admins.includes(ctx.from.id)) {
                                return ctx.answerCbQuery(config.messages[ctx.session?.language || 'en'].adminOnly);
                            }

                            if (action.premium && !ctx.session?.user?.isPremium) {
                                return ctx.answerCbQuery(config.messages[ctx.session?.language || 'en'].premiumOnly);
                            }

                            await action.handler(ctx, next);
                        } catch (err) {
                            console.error(`Error in action ${actionPattern}:`, err);
                            ctx.answerCbQuery('An error occurred.');
                        }
                    });
                }
            });
        }
    });
}

module.exports = { loadActions };