#!/bin/bash

# Script Perbaikan YouTube untuk Lavalink
# Dibuat oleh OpenHands AI

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