const { db } = require('../database');

function premiumMiddleware() {
    return async (ctx, next) => {
        if (!ctx.from) return next();

        const user = await db.getUser(ctx.from.id);
        const isPremium = user?.isPremium || false;
        
        if (!ctx.session) ctx.session = {};
        if (!ctx.session.user) ctx.session.user = {};
        
        ctx.session.user.isPremium = isPremium;
        
        return next();
    };
}

module.exports = { premiumMiddleware };