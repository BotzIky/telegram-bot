require('dotenv').config();

module.exports = {
  bot: {
    token: process.env.BOT_TOKEN, // set bot token in .env file, ex: BOT_TOKEN=7686835601:AAHRBOL3GCqilZ14i92s32sagfWDZM8UpdLcpYs
    admins: process.env.ADMIN_IDS?.split(',').map(id => parseInt(id)) || [] // set admin in .env file, ex: ADMIN_IDS=1234, 0923, 0977
  },
  
  ch: {
    name: '' // @username_channel for send backup
  },

  database: {
    useMongoDb: process.env.USE_MONGODB === 'true', // set false in .env file to use json ex: USE_MONGODB=false
    mongoUri: process.env.MONGODB_URI, // if use mongodb, set mongodb uri in .env file, ex: MONGODB_URI=mongodb://<username>:<password>@<host>:<port>/<database>
    jsonPath: './database/database.json'
  },

  limits: {
    free: {
      dailyLimit: 50, // daily limit
      resetTime: '00:00'
    }
  },

  rateLimit: {
    window: 1000, 
    maxRequests: 3
  },

  languages: {
    default: 'en',
    available: ['id', 'en']
  },

  messages: {
    id: {
      welcome: 'Selamat datang di bot kami!',
      premium: 'Anda adalah pengguna premium!',
      notPremium: 'Anda bukan pengguna premium',
      banned: 'Maaf, akun Anda telah dibanned',
      limitReached: 'Limit harian Anda telah habis',
      adminOnly: 'Perintah ini hanya untuk admin',
      premiumOnly: 'Perintah ini hanya untuk pengguna premium'
    },
    en: {
      welcome: 'Welcome to our bot!',
      premium: 'You are a premium user!',
      notPremium: 'You are not a premium user',
      banned: 'Sorry, your account has been banned',
      limitReached: 'Your daily limit has been reached',
      adminOnly: 'This command is for admins only',
      premiumOnly: 'This command is for premium users only'
    }
  }
};