# Perbaikan Error Aqua Constructor

## Masalah

Saat menjalankan bot musik YouTube, Anda mungkin mengalami error berikut:

```
TypeError: Class constructor Aqua cannot be invoked without 'new'
```

Error ini terjadi karena `Aqua` adalah class yang harus diinisialisasi dengan keyword `new`, tetapi dalam kode asli, `Aqua` dipanggil sebagai fungsi biasa.

## Solusi

Solusi untuk masalah ini sangat sederhana: tambahkan keyword `new` saat menginisialisasi `Aqua`.

### Kode yang Salah:

```javascript
const aqua = Aqua(client, nodes, {
  // options
});
```

### Kode yang Benar:

```javascript
const aqua = new Aqua(client, nodes, {
  // options
});
```

## File yang Diperbaiki

Dalam PR ini, kami menyediakan file `fixed-youtube-bot.js` yang sudah memperbaiki masalah ini. File ini adalah versi lengkap dari bot musik YouTube yang dapat digunakan untuk memutar musik dari YouTube melalui Lavalink.

## Cara Menggunakan

1. Download file `fixed-youtube-bot.js`
2. Edit bagian konfigurasi (nodes dan token)
3. Jalankan dengan perintah:
   ```bash
   node fixed-youtube-bot.js
   ```

## Catatan Penting

- Pastikan Lavalink server sudah berjalan sebelum menjalankan bot
- Pastikan Anda menggunakan versi Node.js yang kompatibel (v14 atau lebih baru)
- Pastikan semua dependensi terinstal dengan benar:
  ```bash
  npm install discord.js aqualink
  ```