const config = require('../config');

function adminMiddleware() {
    return async (ctx, next) => {
        if (!ctx.from) return next();

        const isAdmin = config.bot.admins.includes(ctx.from.id);
        ctx.state.isAdmin = isAdmin;
        
        return next();
    };
}

module.exports = { adminMiddleware };