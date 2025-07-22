#!/bin/bash

# Script untuk menginstal plugin YouTube untuk Lavalink
# Dibuat oleh OpenHands AI

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Script Instalasi Plugin YouTube untuk Lavalink ===${NC}"
echo -e "${YELLOW}Script ini akan menginstal plugin LavaSrc untuk menambahkan dukungan YouTube ke Lavalink${NC}"
echo ""

# Cek apakah Java terinstal
if ! command -v java &> /dev/null; then
    echo -e "${RED}Java tidak ditemukan. Menginstal Java...${NC}"
    apt-get update
    apt-get install -y openjdk-17-jdk
    echo -e "${GREEN}Java berhasil diinstal.${NC}"
else
    echo -e "${GREEN}Java sudah terinstal.${NC}"
fi

# Tanya lokasi instalasi Lavalink
read -p "Masukkan path direktori Lavalink (default: /root/Lavalink): " LAVALINK_DIR
LAVALINK_DIR=${LAVALINK_DIR:-/root/Lavalink}

# Cek apakah direktori Lavalink ada
if [ ! -d "$LAVALINK_DIR" ]; then
    echo -e "${YELLOW}Direktori $LAVALINK_DIR tidak ditemukan. Membuat direktori...${NC}"
    mkdir -p "$LAVALINK_DIR"
    echo -e "${GREEN}Direktori $LAVALINK_DIR berhasil dibuat.${NC}"
fi

# Cek apakah Lavalink.jar ada
if [ ! -f "$LAVALINK_DIR/Lavalink.jar" ]; then
    echo -e "${YELLOW}Lavalink.jar tidak ditemukan. Mengunduh Lavalink...${NC}"
    cd "$LAVALINK_DIR"
    wget https://github.com/lavalink-devs/Lavalink/releases/download/3.7.8/Lavalink.jar
    echo -e "${GREEN}Lavalink.jar berhasil diunduh.${NC}"
else
    echo -e "${GREEN}Lavalink.jar sudah ada.${NC}"
fi

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

# Buat atau perbarui file application.yml
echo -e "${YELLOW}Membuat file konfigurasi application.yml...${NC}"
cat > "$LAVALINK_DIR/application.yml" << EOL
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
  lavasrc:
    sources:
      youtube: true
      spotify: false
      applemusic: false
    youtube:
      defaultSearchProvider: ytsearch
EOL
echo -e "${GREEN}File application.yml berhasil dibuat.${NC}"

# Buat script untuk menjalankan Lavalink
echo -e "${YELLOW}Membuat script start-lavalink.sh...${NC}"
cat > "$LAVALINK_DIR/start-lavalink.sh" << EOL
#!/bin/bash
cd "$LAVALINK_DIR"
java -jar Lavalink.jar
EOL
chmod +x "$LAVALINK_DIR/start-lavalink.sh"
echo -e "${GREEN}Script start-lavalink.sh berhasil dibuat.${NC}"

# Buat service systemd untuk Lavalink
echo -e "${YELLOW}Membuat service systemd untuk Lavalink...${NC}"
cat > /etc/systemd/system/lavalink.service << EOL
[Unit]
Description=Lavalink Server
After=network.target

[Service]
User=root
Type=simple
WorkingDirectory=$LAVALINK_DIR
ExecStart=/usr/bin/java -jar Lavalink.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL
systemctl daemon-reload
echo -e "${GREEN}Service systemd untuk Lavalink berhasil dibuat.${NC}"

echo -e "${YELLOW}Menghentikan Lavalink yang sedang berjalan (jika ada)...${NC}"
systemctl stop lavalink || true
pkill -f Lavalink.jar || true
echo -e "${GREEN}Lavalink berhasil dihentikan.${NC}"

echo -e "${YELLOW}Memulai service Lavalink...${NC}"
systemctl start lavalink
systemctl enable lavalink
echo -e "${GREEN}Service Lavalink berhasil dimulai dan diaktifkan.${NC}"

echo ""
echo -e "${GREEN}=== Instalasi Selesai ===${NC}"
echo -e "${YELLOW}Lavalink server dengan plugin YouTube sekarang berjalan di port 2333${NC}"
echo -e "${YELLOW}Password: youshallnotpass${NC}"
echo ""
echo -e "${YELLOW}Untuk melihat log Lavalink:${NC}"
echo -e "${GREEN}journalctl -u lavalink -f${NC}"
echo ""
echo -e "${YELLOW}Untuk menghentikan Lavalink:${NC}"
echo -e "${GREEN}systemctl stop lavalink${NC}"
echo ""
echo -e "${YELLOW}Untuk memulai Lavalink:${NC}"
echo -e "${GREEN}systemctl start lavalink${NC}"
echo ""
echo -e "${YELLOW}Untuk memeriksa status Lavalink:${NC}"
echo -e "${GREEN}systemctl status lavalink${NC}"
echo ""
echo -e "${YELLOW}Konfigurasi Lavalink berada di:${NC}"
echo -e "${GREEN}$LAVALINK_DIR/application.yml${NC}"
echo ""
echo -e "${GREEN}Selamat! Lavalink dengan dukungan YouTube sekarang siap digunakan.${NC}"