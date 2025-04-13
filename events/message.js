const { Message } = require('../utils/button');
const path = require('path');
const fs = require('fs').promises;

const messages = {
    id: {
        receivedPhoto: 'Foto diterima',
        receivedAudio: 'Audio diterima',
        receivedVideo: 'Video diterima',
        receivedDocument: 'Dokumen diterima',
        receivedSticker: 'Stiker diterima',
        fileInfo: (type, size) => `📝 Tipe File: ${type}\n📊 Ukuran: ${(size / 1024 / 1024).toFixed(2)} MB`,
        downloadSuccess: '✅ File berhasil diunduh',
        downloadError: '❌ Gagal mengunduh file'
    },
    en: {
        receivedPhoto: 'Photo received',
        receivedAudio: 'Audio received',
        receivedVideo: 'Video received',
        receivedDocument: 'Document received',
        receivedSticker: 'Sticker received',
        fileInfo: (type, size) => `📝 File Type: ${type}\n📊 Size: ${(size / 1024 / 1024).toFixed(2)} MB`,
        downloadSuccess: '✅ File downloaded successfully',
        downloadError: '❌ Failed to download file'
    }
};

async function handleFileDownload(ctx, file, type, downloadPath) {
    try {
        const language = ctx.session?.language || 'en';
        const filePath = path.join(downloadPath, `${type}_${Date.now()}${path.extname(file.file_name || '')}`);
        
        await ctx.telegram.getFile(file.file_id)
            .then(file => ctx.telegram.downloadFile(file, filePath));
        
        return messages[language].downloadSuccess;
    } catch (error) {
        console.error(`Error downloading ${type}:`, error);
        return messages[language].downloadError;
    }
}

module.exports = {
    handler: async (ctx) => {
        const user = ctx.session?.user;
        const language = user?.language || 'en';

// Text
        if (ctx.message?.text && !ctx.message.text.startsWith('/')) {
            console.log(`[${user?.id}] Text message:`, ctx.message.text);
        }

// Photo
        else if (ctx.message?.photo) {
            const photo = ctx.message.photo[ctx.message.photo.length - 1]; 
            console.log(`[${user?.id}] Photo received:`, photo);
            
            await Message.send(ctx, messages[language].receivedPhoto);
            await Message.send(ctx, messages[language].fileInfo('Photo', photo.file_size));

            // Optional: Download photo
            // const downloadPath = path.join(__dirname, '../downloads/photos');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, photo, 'photo', downloadPath);
        }

// Audio
        else if (ctx.message?.audio) {
            const audio = ctx.message.audio;
            console.log(`[${user?.id}] Audio received:`, audio);
            
            await Message.send(ctx, messages[language].receivedAudio);
            await Message.send(ctx, messages[language].fileInfo('Audio', audio.file_size));

            // Optional: Download audio
            // const downloadPath = path.join(__dirname, '../downloads/audio');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, audio, 'audio', downloadPath);
        }

// Video
        else if (ctx.message?.video) {
            const video = ctx.message.video;
            console.log(`[${user?.id}] Video received:`, video);
            
            await Message.send(ctx, messages[language].receivedVideo);
            await Message.send(ctx, messages[language].fileInfo('Video', video.file_size));

            // Optional: Download video
            // const downloadPath = path.join(__dirname, '../downloads/videos');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, video, 'video', downloadPath);
        }

// Document
        else if (ctx.message?.document) {
            const document = ctx.message.document;
            console.log(`[${user?.id}] Document received:`, document);
            
            await Message.send(ctx, messages[language].receivedDocument);
            await Message.send(ctx, messages[language].fileInfo(
                document.mime_type || 'Unknown',
                document.file_size
            ));

            // Optional: Download document
            // const downloadPath = path.join(__dirname, '../downloads/documents');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, document, 'document', downloadPath);
        }

// Sticker
        else if (ctx.message?.sticker) {
            const sticker = ctx.message.sticker;
            console.log(`[${user?.id}] Sticker received:`, sticker);
            
            const stickerInfo = `
            ${messages[language].receivedSticker}
            📝 Emoji: ${sticker.emoji || 'N/A'}
            🎨 Animated: ${sticker.is_animated ? 'Yes' : 'No'}
            🎬 Video: ${sticker.is_video ? 'Yes' : 'No'}
            📊 Set Name: ${sticker.set_name || 'N/A'}
            `;
            
            await Message.send(ctx, stickerInfo);

            // Optional: Download sticker
            // const downloadPath = path.join(__dirname, '../downloads/stickers');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, sticker, 'sticker', downloadPath);
        }

// Voice
        else if (ctx.message?.voice) {
            const voice = ctx.message.voice;
            console.log(`[${user?.id}] Voice message received:`, voice);
            
            await Message.send(ctx, `Voice message received\nDuration: ${voice.duration}s`);

            // Optional: Download voice message
            // const downloadPath = path.join(__dirname, '../downloads/voice');
            // await fs.mkdir(downloadPath, { recursive: true });
            // await handleFileDownload(ctx, voice, 'voice', downloadPath);
        }

// Location
        else if (ctx.message?.location) {
            const { latitude, longitude } = ctx.message.location;
            console.log(`[${user?.id}] Location received:`, { latitude, longitude });
            
            await Message.send(ctx, `📍 Location received\nLatitude: ${latitude}\nLongitude: ${longitude}`);
        }

// Contact
        else if (ctx.message?.contact) {
            const contact = ctx.message.contact;
            console.log(`[${user?.id}] Contact received:`, contact);
            
            await Message.send(ctx, `👤 Contact received\nName: ${contact.first_name}\nPhone: ${contact.phone_number}`);
        }
    }
};