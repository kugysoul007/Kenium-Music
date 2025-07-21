#!/bin/bash
# Script instalasi YouTube Music Bot

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Instalasi YouTube Music Bot ===${NC}"
echo -e "${YELLOW}Script ini akan menginstal YouTube Music Bot di folder saat ini.${NC}"
echo

# Cek apakah Node.js terinstal
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js tidak ditemukan. Menginstal Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js berhasil diinstal.${NC}"
else
    echo -e "${GREEN}Node.js sudah terinstal: $(node -v)${NC}"
fi

# Cek apakah npm terinstal
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm tidak ditemukan. Menginstal npm...${NC}"
    sudo apt-get install -y npm
    echo -e "${GREEN}npm berhasil diinstal.${NC}"
else
    echo -e "${GREEN}npm sudah terinstal: $(npm -v)${NC}"
fi

# Buat folder untuk bot
echo -e "${YELLOW}Membuat folder untuk bot...${NC}"
mkdir -p youtube-bot
cd youtube-bot

# Salin file bot
echo -e "${YELLOW}Menyalin file bot...${NC}"
cp ../youtube-bot.js ./
cp ../YOUTUBE-BOT-README.md ./README.md

# Inisialisasi proyek npm
echo -e "${YELLOW}Menginisialisasi proyek npm...${NC}"
npm init -y

# Instal dependensi
echo -e "${YELLOW}Menginstal dependensi...${NC}"
npm install discord.js aqualink

# Cek apakah PM2 terinstal
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 tidak ditemukan. Menginstal PM2...${NC}"
    npm install -g pm2
    echo -e "${GREEN}PM2 berhasil diinstal.${NC}"
else
    echo -e "${GREEN}PM2 sudah terinstal.${NC}"
fi

echo
echo -e "${GREEN}=== Instalasi Selesai ===${NC}"
echo -e "${YELLOW}Sebelum menjalankan bot, pastikan untuk:${NC}"
echo -e "1. Edit file ${GREEN}youtube-bot.js${NC} dan sesuaikan konfigurasi"
echo -e "2. Pastikan server Lavalink sudah berjalan"
echo
echo -e "${YELLOW}Untuk menjalankan bot:${NC}"
echo -e "${GREEN}node youtube-bot.js${NC}"
echo
echo -e "${YELLOW}Untuk menjalankan bot di background dengan PM2:${NC}"
echo -e "${GREEN}pm2 start youtube-bot.js --name youtube-music-bot${NC}"
echo
echo -e "${YELLOW}Untuk melihat log bot:${NC}"
echo -e "${GREEN}pm2 logs youtube-music-bot${NC}"
echo
echo -e "${YELLOW}Untuk menghentikan bot:${NC}"
echo -e "${GREEN}pm2 stop youtube-music-bot${NC}"
echo
echo -e "${GREEN}Selamat menggunakan YouTube Music Bot!${NC}"