const fs = require('fs');
const path = require('path');

function loadEvents(bot) {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath)
        .filter(file => file.endsWith('.js'));

    eventFiles.forEach(eventFile => {
        const event = require(path.join(eventsPath, eventFile));
        const eventName = eventFile.replace('.js', '');

        if (event.handler) {
            bot.on(eventName, async (ctx, next) => {
                try {
                    await event.handler(ctx, next);
                } catch (err) {
                    console.error(`Error in event ${eventName}:`, err);
                }
            });
        }
    });
}

module.exports = { loadEvents };