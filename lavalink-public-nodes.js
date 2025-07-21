/**
 * Daftar node Lavalink publik yang dapat digunakan
 * jika Lavalink lokal Anda tidak berfungsi dengan baik.
 * 
 * Cara menggunakan:
 * 1. Salin salah satu konfigurasi node di bawah
 * 2. Ganti konfigurasi node di bot Anda
 * 3. Restart bot Anda
 */

// Contoh penggunaan:
// const { Aqua } = require("aqualink");
// const client = new Client({...});
// 
// // Gunakan salah satu konfigurasi node di bawah
// const nodes = [PILIH_SALAH_SATU_NODE_DI_BAWAH];
// 
// // PENTING: Gunakan 'new' saat menginisialisasi Aqua
// const aqua = new Aqua(client, nodes, {
//   defaultSearchPlatform: "ytsearch",
//   restVersion: "v4",
//   autoResume: true,
//   infiniteReconnects: true,
// });

// ===== DAFTAR NODE LAVALINK PUBLIK =====

// Node 1: lavalink.oops.wtf
const LAVALINK_OOPS = [
  {
    host: "lavalink.oops.wtf",
    password: "www.freelavalink.org",
    port: 2000,
    secure: false,
    name: "lavalink-oops"
  }
];

// Node 2: lavalink.devz.cloud
const LAVALINK_DEVZ = [
  {
    host: "lavalink.devz.cloud",
    password: "devz.cloud",
    port: 443,
    secure: true,
    name: "lavalink-devz"
  }
];

// Node 3: lavalink.lexnet.cc
const LAVALINK_LEXNET = [
  {
    host: "lavalink.lexnet.cc",
    password: "lexn3tl4v4",
    port: 443,
    secure: true,
    name: "lavalink-lexnet"
  }
];

// Node 4: lavalink.mariliun.ml
const LAVALINK_MARILIUN = [
  {
    host: "lavalink.mariliun.ml",
    password: "lavaliun",
    port: 443,
    secure: true,
    name: "lavalink-mariliun"
  }
];

// Node 5: lavalink.darrenofficial.com
const LAVALINK_DARREN = [
  {
    host: "lavalink.darrenofficial.com",
    password: "anything as a password",
    port: 80,
    secure: false,
    name: "lavalink-darren"
  }
];

// Node 6: lavalink.clxud.dev
const LAVALINK_CLXUD = [
  {
    host: "lavalink.clxud.dev",
    password: "youshallnotpass",
    port: 2333,
    secure: false,
    name: "lavalink-clxud"
  }
];

// Ekspor semua node
module.exports = {
  LAVALINK_OOPS,
  LAVALINK_DEVZ,
  LAVALINK_LEXNET,
  LAVALINK_MARILIUN,
  LAVALINK_DARREN,
  LAVALINK_CLXUD
};