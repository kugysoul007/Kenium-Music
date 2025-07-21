# YouTube Music Bot - Standalone Version

Bot musik Discord sederhana yang menggunakan Lavalink untuk memutar musik dari YouTube. Bot ini dibuat sebagai solusi terpisah untuk mengatasi masalah pemutaran YouTube di bot musik utama.

## Fitur

- Memutar musik dari YouTube (URL atau kata kunci pencarian)
- Mendukung playlist YouTube
- Kontrol pemutaran (skip, pause, stop)
- Pengaturan volume
- Antrian lagu
- Tampilan embed yang informatif

## Persyaratan

- Node.js v16.9.0 atau lebih baru
- Server Lavalink yang berjalan
- Bot Discord dengan intents yang diperlukan

## Cara Menggunakan

### 1. Persiapan

1. Pastikan Anda memiliki server Lavalink yang berjalan
2. Pastikan Anda memiliki bot Discord dengan intents yang diperlukan:
   - `GUILDS`
   - `GUILD_MEMBERS`
   - `GUILD_MESSAGES`
   - `MESSAGE_CONTENT`
   - `GUILD_VOICE_STATES`

### 2. Instalasi

1. Upload file `youtube-bot.js` ke VPS Anda
2. Install dependensi yang diperlukan:

```bash
# Buat folder baru untuk bot (opsional)
mkdir youtube-bot
cd youtube-bot

# Salin file youtube-bot.js ke folder ini

# Install dependensi
npm init -y
npm install discord.js aqualink
```

### 3. Konfigurasi

Edit bagian konfigurasi di file `youtube-bot.js`:

```javascript
const CONFIG = {
    // Konfigurasi Lavalink
    nodes: [
        {
            host: "127.0.0.1",        // Ganti dengan IP Lavalink server
            password: "youshallnotpass", // Ganti dengan password Lavalink
            port: 2333,               // Ganti dengan port Lavalink (biasanya 2333)
            secure: false,            // Ganti menjadi true jika menggunakan SSL/HTTPS
            name: "main-node"
        }
    ],
    
    // Token bot Discord
    token: "TOKEN_BOT_ANDA_DISINI",  // Ganti dengan token bot Discord Anda
    
    // Prefix untuk command (default: !)
    prefix: "!",
    
    // Status bot
    status: {
        text: "YouTube Music | !play",
        type: ActivityType.Listening
    },
    
    // Warna untuk embed
    embedColor: 0x3498db
};
```

### 4. Menjalankan Bot

```bash
# Jalankan bot
node youtube-bot.js

# Untuk menjalankan bot di background dengan PM2
pm2 start youtube-bot.js --name youtube-music-bot
```

### 5. Menggunakan Bot

Setelah bot online, Anda dapat menggunakan command berikut di server Discord:

- `!play [query]` - Memutar lagu dari YouTube (URL atau kata kunci)
- `!skip` - Melewati lagu yang sedang diputar
- `!stop` - Menghentikan pemutaran dan meninggalkan voice channel
- `!pause` - Menjeda/melanjutkan pemutaran
- `!volume [0-100]` - Mengatur volume pemutaran
- `!queue` - Menampilkan antrian lagu
- `!help` - Menampilkan bantuan

## Troubleshooting

### Bot tidak dapat terhubung ke Lavalink

1. Pastikan server Lavalink berjalan
2. Periksa konfigurasi host, port, dan password
3. Pastikan tidak ada firewall yang memblokir koneksi

### Bot tidak dapat memutar musik dari YouTube

1. Pastikan Lavalink memiliki plugin YouTube yang tepat
2. Periksa log Lavalink untuk error
3. Coba gunakan URL YouTube yang berbeda

### Bot tidak merespons command

1. Pastikan bot memiliki intents yang diperlukan
2. Periksa apakah bot memiliki izin yang diperlukan di server
3. Pastikan Anda menggunakan prefix yang benar

## Konfigurasi Lavalink

Pastikan server Lavalink Anda memiliki konfigurasi yang tepat untuk YouTube. Contoh konfigurasi `application.yml`:

```yaml
server:
  port: 2333
  address: 0.0.0.0
lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: false
    bufferDurationMs: 400
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true

plugins:
  - dependency: "com.github.topi314.lavasrc:lavasrc-plugin:4.0.0"
    repository: "https://maven.lavalink.dev/releases"
    snapshot: false
```

## Catatan Penting

- Bot ini dirancang sebagai solusi terpisah dan tidak akan mengganggu bot musik utama Anda
- Pastikan untuk selalu menjalankan Lavalink terlebih dahulu sebelum menjalankan bot
- Jika Anda mengalami masalah dengan pemutaran YouTube, periksa log Lavalink untuk informasi lebih lanjut