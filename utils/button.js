class Keyboard {
    static createButton(text, callback_data) {
        return { text, callback_data };
    }

    static createUrl(text, url) {
        return { text, url };
    }

    static row(...buttons) {
        return buttons;
    }

    static keyboard(...rows) {
        return {
            reply_markup: {
                inline_keyboard: rows
            }
        };
    }

    static backButton(callback = 'start2') {
        return this.row(this.createButton('⬅️', callback));
    }

    static homeButton() {
        return this.row(this.createButton('🏠', 'start2'));
    }

    static removeKeyboard() {
        return {
            reply_markup: {
                remove_keyboard: true
            }
        };
    }

    static forceReply() {
        return {
            reply_markup: {
                force_reply: true
            }
        };
    }

    static customKeyboard(keyboard, options = {}) {
        return {
            reply_markup: {
                keyboard,
                resize_keyboard: options.resize ?? true,
                one_time_keyboard: options.oneTime ?? false,
                selective: options.selective ?? false
            }
        };
    }
}

class Message {
    static defaultOptions = {
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        disable_notification: false
    };

    static async edit(ctx, text, extra = {}) {
        try {
            return await ctx.editMessageText(text, {
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error editing message:', err);
            return null;
        }
    }

    static async send(ctx, text, extra = {}) {
        try {
            return await ctx.reply(text, {
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending message:', err);
            return null;
        }
    }

    static async notify(ctx, text) {
        try {
            return await ctx.answerCbQuery(text);
        } catch (err) {
            console.error('Error sending notification:', err);
            return null;
        }
    }

    static async sendPhoto(ctx, photo, caption = '', extra = {}) {
        try {
            return await ctx.replyWithPhoto(photo, {
                caption,
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending photo:', err);
            return null;
        }
    }

    static async sendVideo(ctx, video, caption = '', extra = {}) {
        try {
            return await ctx.replyWithVideo(video, {
                caption,
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending video:', err);
            return null;
        }
    }

    static async sendAudio(ctx, audio, caption = '', extra = {}) {
        try {
            return await ctx.replyWithAudio(audio, {
                caption,
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending audio:', err);
            return null;
        }
    }

    static async sendVoice(ctx, voice, caption = '', extra = {}) {
        try {
            return await ctx.replyWithVoice(voice, {
                caption,
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending voice:', err);
            return null;
        }
    }

    static async sendDocument(ctx, document, caption = '', extra = {}) {
        try {
            return await ctx.replyWithDocument(document, {
                caption,
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error sending document:', err);
            return null;
        }
    }

    static async sendSticker(ctx, sticker, extra = {}) {
        try {
            return await ctx.replyWithSticker(sticker, extra);
        } catch (err) {
            console.error('Error sending sticker:', err);
            return null;
        }
    }

    static async sendLocation(ctx, latitude, longitude, extra = {}) {
        try {
            return await ctx.replyWithLocation(latitude, longitude, extra);
        } catch (err) {
            console.error('Error sending location:', err);
            return null;
        }
    }

    static async sendVenue(ctx, latitude, longitude, title, address, extra = {}) {
        try {
            return await ctx.replyWithVenue(latitude, longitude, title, address, extra);
        } catch (err) {
            console.error('Error sending venue:', err);
            return null;
        }
    }

    static async sendContact(ctx, phone_number, first_name, extra = {}) {
        try {
            return await ctx.replyWithContact(phone_number, first_name, extra);
        } catch (err) {
            console.error('Error sending contact:', err);
            return null;
        }
    }

    static async sendMarkdown(ctx, text, extra = {}) {
        try {
            return await ctx.reply(text, {
                parse_mode: 'Markdown',
                ...extra
            });
        } catch (err) {
            console.error('Error sending markdown message:', err);
            return null;
        }
    }

    static async sendMediaGroup(ctx, media, extra = {}) {
        try {
            return await ctx.replyWithMediaGroup(media, extra);
        } catch (err) {
            console.error('Error sending media group:', err);
            return null;
        }
    }

    static async editCaption(ctx, caption, extra = {}) {
        try {
            return await ctx.editMessageCaption(caption, {
                ...this.defaultOptions,
                ...extra
            });
        } catch (err) {
            console.error('Error editing caption:', err);
            return null;
        }
    }

    static async editMedia(ctx, media, extra = {}) {
        try {
            return await ctx.editMessageMedia(media, extra);
        } catch (err) {
            console.error('Error editing media:', err);
            return null;
        }
    }

    static async delete(ctx) {
        try {
            return await ctx.deleteMessage();
        } catch (err) {
            console.error('Error deleting message:', err);
            return null;
        }
    }

    static async uploadFile(ctx, file) {
        try {
            return await ctx.telegram.getFile(file);
        } catch (err) {
            console.error('Error uploading file:', err);
            return null;
        }
    }
}

module.exports = {
    Keyboard,
    Message
};