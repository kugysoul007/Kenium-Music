# Perbaikan Lavalink untuk YouTube

Berdasarkan log yang Anda berikan, Lavalink server Anda terhubung tetapi mengembalikan `loadType: "error"` saat mencoba memuat URL YouTube. Berikut adalah langkah-langkah untuk memperbaiki masalah ini:

## 1. Periksa Konfigurasi Lavalink

Pastikan file `application.yml` Lavalink Anda memiliki konfigurasi yang benar untuk YouTube. Berikut adalah contoh konfigurasi yang benar:

```yaml
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
```

Pastikan `youtube: true` dan `youtubeSearchEnabled: true` diatur dengan benar.

## 2. Gunakan Lavalink Versi Terbaru

Jika Anda menggunakan Lavalink versi lama, coba upgrade ke versi terbaru. Versi terbaru yang stabil adalah Lavalink v3.7.8.

Anda dapat mengunduhnya dari: https://github.com/lavalink-devs/Lavalink/releases/tag/3.7.8

## 3. Gunakan Plugin Tambahan untuk YouTube

Jika Anda masih mengalami masalah, coba gunakan plugin tambahan untuk YouTube. Ada beberapa plugin yang dapat membantu:

### LavaSrc (Direkomendasikan)
LavaSrc adalah plugin yang menambahkan dukungan untuk YouTube, Spotify, dan Apple Music.

1. Unduh LavaSrc dari: https://github.com/topi314/LavaSrc/releases
2. Letakkan file JAR di folder `plugins` di direktori Lavalink Anda
3. Tambahkan konfigurasi berikut di `application.yml`:

```yaml
plugins:
  lavasrc:
    sources:
      youtube: true
      spotify: false
      applemusic: false
    youtube:
      defaultSearchProvider: ytsearch
```

### Lavalink-YoutubeAPI
Plugin alternatif yang dapat Anda gunakan:

1. Unduh dari: https://github.com/Walkyst/Lavalink-YoutubeAPI/releases
2. Letakkan file JAR di folder `plugins` di direktori Lavalink Anda

## 4. Restart Lavalink Server

Setelah melakukan perubahan, restart Lavalink server Anda:

```bash
# Hentikan Lavalink yang sedang berjalan
pkill -f Lavalink.jar

# Jalankan kembali Lavalink
java -jar Lavalink.jar
```

## 5. Periksa Log Lavalink

Periksa log Lavalink untuk melihat apakah ada error spesifik yang terkait dengan YouTube:

```bash
tail -f logs/spring.log
```

## 6. Gunakan URL YouTube yang Valid

Pastikan URL YouTube yang Anda gunakan valid dan dapat diakses. Beberapa contoh URL yang valid:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

## 7. Coba Gunakan Pencarian Kata Kunci

Jika URL langsung tidak berfungsi, coba gunakan pencarian kata kunci:

```
!play never gonna give you up
```

## 8. Periksa Koneksi Internet Server

Pastikan server Anda memiliki akses internet yang baik dan dapat mengakses YouTube. Beberapa penyedia VPS mungkin memblokir akses ke YouTube.

```bash
ping youtube.com
curl -I https://www.youtube.com
```

## 9. Gunakan IP Proxy (Jika Diperlukan)

Jika server Anda diblokir dari mengakses YouTube, Anda mungkin perlu menggunakan proxy. Tambahkan konfigurasi berikut di `application.yml`:

```yaml
lavalink:
  server:
    httpConfig:
      proxyHost: "proxy.example.com"
      proxyPort: 3128
```

## 10. Gunakan Versi Aqualink yang Kompatibel

Pastikan versi Aqualink yang Anda gunakan kompatibel dengan Lavalink server Anda. Versi terbaru Aqualink adalah 2.7.3-hotfix.

```bash
npm install aqualink@2.7.3-hotfix
```