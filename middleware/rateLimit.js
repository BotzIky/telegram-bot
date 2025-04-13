const config = require('../config');

const requests = new Map();

function rateLimit() {
    return async (ctx, next) => {
        if (!ctx.from) return next();

        const now = Date.now();
        const userId = ctx.from.id;
        
        if (!requests.has(userId)) {
            requests.set(userId, []);
        }

        const userRequests = requests.get(userId);
        const windowStart = now - config.rateLimit.window;
        
        while (userRequests.length && userRequests[0] < windowStart) {
            userRequests.shift();
        }

        if (userRequests.length >= config.rateLimit.maxRequests) {
            return ctx.reply('Too many requests. Please wait a moment.');
        }

        userRequests.push(now);
        return next();
    };
}

module.exports = { rateLimit };