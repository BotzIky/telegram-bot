const { db } = require('../database');
const config = require('../config');

function userCheck() {
    return async (ctx, next) => {
        if (!ctx.from) return next();

        try {
            let user = await db.getUser(ctx.from.id);
            
            if (!user) {
                user = await db.createUser({
                    id: ctx.from.id,
                    username: ctx.from.username,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name,
                    language: ctx.from.language_code || config.languages.default,
                    isPremium: false,
                    isBanned: false,
                    dailyLimit: 0,
                    joinDate: new Date()
                });
            }

            if (user.isBanned) {
                return ctx.reply(config.messages[user.language || 'en'].banned);
            }

            if (!ctx.session) ctx.session = {};
            ctx.session.user = user;
            ctx.session.language = user.language;

            return next();
        } catch (err) {
            console.error('Error in userCheck middleware:', err);
            return next();
        }
    };
}

module.exports = { userCheck };