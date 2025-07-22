# Perbaikan YouTube untuk Lavalink

Dokumen ini berisi langkah-langkah untuk memperbaiki masalah pemutaran YouTube di Lavalink.

## Masalah

Saat mencoba memutar URL YouTube dengan Lavalink, Anda mungkin mendapatkan error seperti:

```
[Cloud Nine] Hasil pencarian: {
  "loadType": "error",
  "tracksCount": 0
}
```

## Solusi

### 1. Perbaiki Konfigurasi Lavalink

File `application.yml` Lavalink perlu dikonfigurasi dengan benar untuk mendukung YouTube. Gunakan konfigurasi berikut:

```yaml
server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      soundcloud: true
      bandcamp: true
      twitch: true
      vimeo: true
      http: true
      local: false
    youtubeSearchEnabled: true # PENTING: Aktifkan pencarian YouTube
    soundcloudSearchEnabled: true
    youtube:
      playlistLoadLimit: 6
      hotfix: true # Aktifkan hotfix untuk YouTube
    resuming:
      enabled: true
      timeout: 60
    bufferDurationMs: 400
    frameBufferDurationMs: 5000
    opusEncodingTimeoutMs: 60000
    httpConfig:
      connectTimeout: 10000
      readTimeout: 10000
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

# Plugin LavaSrc untuk dukungan YouTube yang lebih baik
plugins:
  lavasrc:
    sources:
      youtube: true
      spotify: false
      applemusic: false
    youtube:
      defaultSearchProvider: ytsearch

logging:
  file:
    max-size: 1GB
    max-history: 30
  path: ./logs/
  level:
    root: INFO
    lavalink: DEBUG
```

### 2. Instal Plugin LavaSrc

Plugin LavaSrc sangat penting untuk mendukung YouTube dengan lebih baik:

```bash
mkdir -p /root/lavalink-v4/plugins
cd /root/lavalink-v4/plugins
wget https://github.com/topi314/LavaSrc/releases/download/v3.2.7/lavasrc-plugin-3.2.7.jar
```

### 3. Restart Lavalink

Setelah mengubah konfigurasi dan menginstal plugin, restart Lavalink:

```bash
# Jika menggunakan systemd
systemctl restart lavalink

# Atau jika menjalankan secara manual
pkill -f Lavalink.jar
cd /root/lavalink-v4
java -jar Lavalink.jar
```

## Script Otomatis

Untuk mempermudah, Anda dapat menggunakan script otomatis berikut:

```bash
#!/bin/bash

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Script Perbaikan YouTube untuk Lavalink ===${NC}"

# Tanya lokasi instalasi Lavalink
read -p "Masukkan path direktori Lavalink (default: /root/lavalink-v4): " LAVALINK_DIR
LAVALINK_DIR=${LAVALINK_DIR:-/root/lavalink-v4}

# Buat direktori plugins jika belum ada
if [ ! -d "$LAVALINK_DIR/plugins" ]; then
    echo -e "${YELLOW}Direktori plugins tidak ditemukan. Membuat direktori...${NC}"
    mkdir -p "$LAVALINK_DIR/plugins"
    echo -e "${GREEN}Direktori plugins berhasil dibuat.${NC}"
fi

# Unduh plugin LavaSrc
echo -e "${YELLOW}Mengunduh plugin LavaSrc...${NC}"
cd "$LAVALINK_DIR/plugins"
wget https://github.com/topi314/LavaSrc/releases/download/v3.2.7/lavasrc-plugin-3.2.7.jar
echo -e "${GREEN}Plugin LavaSrc berhasil diunduh.${NC}"

# Backup file application.yml yang lama
echo -e "${YELLOW}Membuat backup file application.yml...${NC}"
if [ -f "$LAVALINK_DIR/application.yml" ]; then
    cp "$LAVALINK_DIR/application.yml" "$LAVALINK_DIR/application.yml.backup"
    echo -e "${GREEN}Backup file application.yml berhasil dibuat: application.yml.backup${NC}"
fi

# Buat file application.yml baru
echo -e "${YELLOW}Membuat file konfigurasi application.yml baru...${NC}"
cat > "$LAVALINK_DIR/application.yml" << EOL
server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      soundcloud: true
      bandcamp: true
      twitch: true
      vimeo: true
      http: true
      local: false
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    youtube:
      playlistLoadLimit: 6
      hotfix: true
    resuming:
      enabled: true
      timeout: 60
    bufferDurationMs: 400
    frameBufferDurationMs: 5000
    opusEncodingTimeoutMs: 60000
    httpConfig:
      connectTimeout: 10000
      readTimeout: 10000
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

plugins:
  lavasrc:
    sources:
      youtube: true
      spotify: false
      applemusic: false
    youtube:
      defaultSearchProvider: ytsearch

logging:
  file:
    max-size: 1GB
    max-history: 30
  path: ./logs/
  level:
    root: INFO
    lavalink: DEBUG
EOL
echo -e "${GREEN}File application.yml berhasil dibuat.${NC}"

# Restart Lavalink
echo -e "${YELLOW}Menghentikan Lavalink yang sedang berjalan (jika ada)...${NC}"
systemctl stop lavalink 2>/dev/null || true
pkill -f Lavalink.jar 2>/dev/null || true
echo -e "${GREEN}Lavalink berhasil dihentikan.${NC}"

echo -e "${YELLOW}Memulai Lavalink...${NC}"
cd "$LAVALINK_DIR"
nohup java -jar Lavalink.jar > lavalink.log 2>&1 &
echo -e "${GREEN}Lavalink berhasil dimulai.${NC}"

echo ""
echo -e "${GREEN}=== Perbaikan Selesai ===${NC}"
echo -e "${YELLOW}Lavalink dengan dukungan YouTube sekarang berjalan di port 2333${NC}"
echo -e "${YELLOW}Password: youshallnotpass${NC}"
echo ""
echo -e "${YELLOW}Untuk melihat log Lavalink:${NC}"
echo -e "${GREEN}tail -f $LAVALINK_DIR/lavalink.log${NC}"
echo ""
echo -e "${GREEN}Selamat! Lavalink dengan dukungan YouTube sekarang siap digunakan.${NC}"
```

## Solusi Alternatif

Jika Anda masih mengalami masalah, coba gunakan Lavalink publik:

```javascript
const nodes = [
  {
    host: "lavalink.oops.wtf",
    password: "www.freelavalink.org",
    port: 2000,
    secure: false,
  }
];
```

## Format URL YouTube yang Didukung

Setelah memperbaiki Lavalink, Anda dapat menggunakan format URL YouTube berikut:

1. URL Video Standar:
   ```
   !play https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. URL Video Pendek:
   ```
   !play https://youtu.be/dQw4w9WgXcQ
   ```

3. URL Playlist:
   ```
   !play https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI
   ```

4. Pencarian Kata Kunci:
   ```
   !play never gonna give you up
   ```