# Telegram Bot

A powerful, feature-rich Telegram bot framework built with Node.js that includes scheduling, database integration, customizable commands, and automated responses.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-green)
![Telegraf](https://img.shields.io/badge/Telegraf-4.12.2-blue)

## 🌟 Features

- 🔐 **Advanced User Management**
  - Premium user system
  - User banning/unbanning
  - Daily usage limits
  - Admin privileges

- 💾 **Flexible Database Support**
  - MongoDB integration
  - JSON file-based storage
  - Automatic backups
  - Data restoration

- 🌐 **Multi-language Support**
  - English and Indonesian languages
  - Easily extendable to other languages
  - Per-user language preferences

- ⚡ **Performance & Security**
  - Rate limiting
  - Session management
  - Error handling
  - Scheduled tasks

- 📦 **Message Handling**
  - Text messages
  - Photos
  - Videos
  - Documents
  - Audio
  - Stickers
  - Location
  - Contacts

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Admin Commands](#admin-commands)
6. [Premium Features](#premium-features)
7. [Database Management](#database-management)
8. [Adding New Features](#adding-new-features)
9. [Directory Structure](#directory-structure)
10. [Contributing](#contributing)
11. [License](#license)

## 🔧 Prerequisites

- Node.js >= 14.0.0
- NPM >= 6.0.0
- MongoDB (optional)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/BotzIky/telegram-bot.git
cd telegram-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=your_mongodb_uri
USE_MONGODB=true
ADMIN_IDS=123456789,987654321
```

4. Start the bot:
```bash
npm start
```

## ⚙️ Configuration

### Bot Configuration (config.js)

```javascript
module.exports = {
  bot: {
    token: process.env.BOT_TOKEN,
    admins: process.env.ADMIN_IDS?.split(',').map(id => parseInt(id)) || []
  },
  
  // Channel for backups
  ch: {
    name: '@your_channel'  // Optional
  },

  // Database settings
  database: {
    useMongoDb: process.env.USE_MONGODB === 'true',
    mongoUri: process.env.MONGODB_URI,
    jsonPath: './database/database.json'
  },

  // User limits
  limits: {
    free: {
      dailyLimit: 50,
      resetTime: '00:00'
    }
  },

  // Rate limiting
  rateLimit: {
    window: 1000,
    maxRequests: 3
  }
}
```

## 🎯 Usage

### Basic Commands

- `/start` - Start the bot, show help message, show main menu, view user profile, premium information, about the bot

### Admin Commands

- `/ban <user_id>` - Ban a user
- `/unban <user_id>` - Unban a user
- `/premium <user_id> <day>` Add premium user
- `/delpremium <user_id>` Delete premium user
- `/backup` - Create database backup
- `/restore` - Restore database from backup

### Premium Features

1. **Activation**
   - Premium can be activated through admin commands
   - Time-based premium subscriptions
   - Automatic expiration handling

2. **Benefits**
   - No daily limits
   - Access to premium-only commands
   - Priority support

## 📊 Database Management

### MongoDB Setup

1. Create MongoDB database
2. Set `USE_MONGODB=true` in `.env`
3. Provide MongoDB URI in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### JSON Storage

If MongoDB is not used (`USE_MONGODB=false`):
- Data is stored in `database/database.json`
- Automatic backups are created in `database/backup/`
- Manual backups can be created using `/backup`

## 🔨 Adding New Features

### Creating New Commands

1. Create a new file in `commands/user/` or `commands/admin/`:

```javascript
module.exports = {
    admin: false, // true for admin commands
    premium: false, // true for premium commands
    limit: false, // true for using limit
    handler: async (ctx) => {
        // Your command logic here
    }
};
```

### Creating New Actions

1. Create a new file in `actions/`:

```javascript
module.exports = {
    pattern: 'actionName',
    admin: false, // true for admin commands
    premium: false, // true for premium commands
    handler: async (ctx) => {
        // Your action logic here
    }
};
```

### Adding New Languages

1. Add language code to `config.js`:
```javascript
languages: {
    available: ['id', 'en', 'your_language_code']
}
```

2. Add translations in message files:
```javascript
messages: {
    your_language_code: {
        welcome: 'Your welcome message',
        // other translations
    }
}
```

## 📁 Directory Structure

```
telegram-bot/
├── actions/           # Button actions and callbacks
├── commands/          # Bot commands
│   ├── admin/        # Admin-only commands
│   └── user/         # User commands
├── database/         # Database operations
├── events/           # Event handlers
├── handlers/         # Main handlers
├── middleware/       # Bot middlewares
├── utils/           # Utility functions
├── .env             # Environment variables
├── config.js        # Bot configuration
└── index.js         # Main entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📮 Contact

- Email: support@botzaku.eu.org
- Telegram: [BotzAku](https://t.me/Botz_Aku)
- Website: https://www.botzaku.eu.org
- Issues: [GitHub Issues](https://github.com/BotzIky/telegram-bot/issues)

---

⭐️ Star this repository if you find it helpful!
