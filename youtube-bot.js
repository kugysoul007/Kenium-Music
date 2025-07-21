/**
 * YouTube Music Bot - Standalone Version
 * 
 * Cara menggunakan:
 * 1. Pastikan Lavalink server sudah berjalan
 * 2. Edit konfigurasi di bawah (nodes dan token)
 * 3. Jalankan dengan: node youtube-bot.js
 * 4. Gunakan command !play [query] di Discord
 */

const { Aqua } = require("aqualink");
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require("discord.js");

// ===== KONFIGURASI =====
// Edit bagian ini sesuai dengan konfigurasi Anda
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
// ======================

// Inisialisasi client Discord.js
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Inisialisasi Aqua (Lavalink client)
const aqua = Aqua(client, CONFIG.nodes, {
    defaultSearchPlatform: "ytsearch",
    restVersion: "v4",
    autoResume: true,
    infiniteReconnects: true,
    shouldDeleteMessage: true,
    leaveOnEnd: false,
});

client.aqua = aqua;

// Event: Bot siap
client.once("ready", () => {
    console.log(`Bot siap! Login sebagai ${client.user.tag}`);
    
    // Set status bot
    client.user.setActivity(CONFIG.status.text, { type: CONFIG.status.type });
    
    // Inisialisasi Aqua dengan ID bot
    client.aqua.init(client.user.id);
    
    console.log("Terhubung ke node Lavalink:");
    CONFIG.nodes.forEach(node => {
        console.log(`- ${node.name}: ${node.host}:${node.port}`);
    });
    
    console.log(`\nGunakan ${CONFIG.prefix}play [query] untuk memutar musik`);
});

// Event: Update voice state untuk Lavalink
client.on("raw", (d) => {
    if (d.t === "VOICE_STATE_UPDATE" || d.t === "VOICE_SERVER_UPDATE") {
        client.aqua.updateVoiceState(d);
    }
});

// Event: Pesan baru
client.on("messageCreate", async (message) => {
    // Abaikan pesan dari bot
    if (message.author.bot) return;
    
    // Abaikan pesan yang tidak dimulai dengan prefix
    if (!message.content.startsWith(CONFIG.prefix)) return;
    
    // Parse command dan argumen
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Command: play
    if (command === "play") {
        // Periksa apakah user berada di voice channel
        if (!message.member.voice.channel) {
            return message.reply("❌ Anda harus berada di voice channel untuk menggunakan command ini.");
        }
        
        // Periksa apakah ada query
        const query = args.join(" ");
        if (!query) {
            return message.reply(`❌ Silakan berikan query. Contoh: ${CONFIG.prefix}play lagu favorit`);
        }
        
        try {
            // Kirim pesan loading
            const loadingMsg = await message.channel.send("🔍 Mencari...");
            
            // Buat atau dapatkan player
            const player = client.aqua.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                deaf: true,
                defaultVolume: 70,
            });
            
            // Resolve query
            console.log(`[${message.guild.name}] Mencari: ${query}`);
            const resolve = await client.aqua.resolve({ 
                query, 
                requester: message.member 
            });
            
            // Log hasil resolve untuk debugging
            console.log(`[${message.guild.name}] Hasil pencarian:`, 
                JSON.stringify({
                    loadType: resolve?.loadType,
                    tracksCount: resolve?.tracks?.length || 0
                }, null, 2)
            );
            
            // Handle hasil resolve
            if (!resolve || (!resolve.tracks && !resolve.playlistInfo)) {
                await loadingMsg.edit("❌ Tidak ditemukan hasil untuk query tersebut.");
                return;
            }
            
            // Buat embed sesuai tipe hasil
            let embed = new EmbedBuilder()
                .setColor(CONFIG.embedColor)
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();
            
            // Handle berbagai tipe loadType
            if (resolve.loadType === 'playlist' || resolve.loadType === 'PLAYLIST_LOADED') {
                // Playlist
                for (const track of resolve.tracks) {
                    player.queue.add(track);
                }
                
                embed.setTitle("✅ Playlist Ditambahkan")
                    .setDescription(`Ditambahkan **${resolve.tracks.length} lagu** dari playlist **${resolve.playlistInfo.name}** ke dalam antrian.`)
                    .setThumbnail(resolve.tracks[0]?.info?.thumbnail || null);
                
                await loadingMsg.edit({ content: null, embeds: [embed] });
                
                if (!player.playing && !player.paused) {
                    player.play();
                }
            } 
            else if (resolve.loadType === 'search' || resolve.loadType === 'track' || 
                     resolve.loadType === 'TRACK_LOADED' || resolve.loadType === 'SEARCH_RESULT') {
                // Single track
                const track = resolve.tracks[0];
                player.queue.add(track);
                
                embed.setTitle("✅ Lagu Ditambahkan")
                    .setDescription(`Ditambahkan [**${track.info.title}**](${track.info.uri}) ke dalam antrian.`)
                    .setThumbnail(track.info.thumbnail || null)
                    .addFields(
                        { name: "Artis", value: track.info.author || "Unknown", inline: true },
                        { name: "Durasi", value: formatTime(track.info.length) || "Unknown", inline: true }
                    );
                
                await loadingMsg.edit({ content: null, embeds: [embed] });
                
                if (!player.playing && !player.paused) {
                    player.play();
                }
            } 
            else if (resolve.loadType === 'LOAD_FAILED') {
                // Error loading
                embed.setTitle("❌ Error")
                    .setDescription(`Gagal memuat lagu: ${resolve.exception?.message || 'Unknown error'}`);
                
                await loadingMsg.edit({ content: null, embeds: [embed] });
            } 
            else if (resolve.loadType === 'NO_MATCHES') {
                // No matches
                embed.setTitle("❌ Tidak Ditemukan")
                    .setDescription(`Tidak ditemukan hasil untuk query: ${query}`);
                
                await loadingMsg.edit({ content: null, embeds: [embed] });
            } 
            else {
                // Unknown loadType
                console.log(`[${message.guild.name}] Unknown loadType:`, resolve.loadType);
                embed.setTitle("❌ Error")
                    .setDescription(`Tipe hasil tidak dikenali: ${resolve.loadType}`);
                
                await loadingMsg.edit({ content: null, embeds: [embed] });
            }
        } catch (error) {
            console.error(`[${message.guild.name}] Error:`, error);
            message.channel.send(`❌ Terjadi error: ${error.message}`);
        }
    }
    
    // Command: skip
    else if (command === "skip") {
        const player = client.aqua.players.get(message.guild.id);
        if (!player) return message.reply("❌ Tidak ada musik yang sedang diputar.");
        
        player.stop();
        message.reply("⏭️ Melewati lagu saat ini.");
    }
    
    // Command: stop
    else if (command === "stop") {
        const player = client.aqua.players.get(message.guild.id);
        if (!player) return message.reply("❌ Tidak ada musik yang sedang diputar.");
        
        player.destroy();
        message.reply("⏹️ Menghentikan pemutaran dan meninggalkan voice channel.");
    }
    
    // Command: pause
    else if (command === "pause") {
        const player = client.aqua.players.get(message.guild.id);
        if (!player) return message.reply("❌ Tidak ada musik yang sedang diputar.");
        
        player.pause(!player.paused);
        message.reply(player.paused ? "⏸️ Musik dijeda." : "▶️ Musik dilanjutkan.");
    }
    
    // Command: volume
    else if (command === "volume") {
        const player = client.aqua.players.get(message.guild.id);
        if (!player) return message.reply("❌ Tidak ada musik yang sedang diputar.");
        
        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply("❌ Volume harus berupa angka antara 0-100.");
        }
        
        player.setVolume(volume);
        message.reply(`🔊 Volume diatur ke ${volume}%.`);
    }
    
    // Command: queue
    else if (command === "queue") {
        const player = client.aqua.players.get(message.guild.id);
        if (!player) return message.reply("❌ Tidak ada musik yang sedang diputar.");
        
        const queue = player.queue;
        if (!queue.size) return message.reply("❌ Antrian kosong.");
        
        const embed = new EmbedBuilder()
            .setTitle("📋 Antrian Musik")
            .setColor(CONFIG.embedColor);
        
        const current = queue.current;
        const items = queue.items;
        
        let description = `**Sedang Diputar:**\n[${current.info.title}](${current.info.uri}) - ${formatTime(current.info.length)}\n\n`;
        
        if (items.length) {
            description += "**Berikutnya:**\n";
            items.slice(0, 10).forEach((track, index) => {
                description += `${index + 1}. [${track.info.title}](${track.info.uri}) - ${formatTime(track.info.length)}\n`;
            });
            
            if (items.length > 10) {
                description += `\n...dan ${items.length - 10} lagu lainnya.`;
            }
        }
        
        embed.setDescription(description);
        message.reply({ embeds: [embed] });
    }
    
    // Command: help
    else if (command === "help") {
        const embed = new EmbedBuilder()
            .setTitle("🎵 YouTube Music Bot - Bantuan")
            .setColor(CONFIG.embedColor)
            .setDescription("Berikut adalah daftar command yang tersedia:")
            .addFields(
                { name: `${CONFIG.prefix}play [query]`, value: "Memutar lagu dari YouTube" },
                { name: `${CONFIG.prefix}skip`, value: "Melewati lagu yang sedang diputar" },
                { name: `${CONFIG.prefix}stop`, value: "Menghentikan pemutaran dan meninggalkan voice channel" },
                { name: `${CONFIG.prefix}pause`, value: "Menjeda/melanjutkan pemutaran" },
                { name: `${CONFIG.prefix}volume [0-100]`, value: "Mengatur volume pemutaran" },
                { name: `${CONFIG.prefix}queue`, value: "Menampilkan antrian lagu" },
                { name: `${CONFIG.prefix}help`, value: "Menampilkan bantuan" }
            )
            .setFooter({ text: "YouTube Music Bot" });
        
        message.reply({ embeds: [embed] });
    }
});

// Event: Track start
client.aqua.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;
    
    const embed = new EmbedBuilder()
        .setTitle("🎵 Sedang Diputar")
        .setDescription(`[**${track.info.title}**](${track.info.uri})`)
        .setColor(CONFIG.embedColor)
        .setThumbnail(track.info.thumbnail || null)
        .addFields(
            { name: "Artis", value: track.info.author || "Unknown", inline: true },
            { name: "Durasi", value: formatTime(track.info.length) || "Unknown", inline: true },
            { name: "Requested By", value: track.info.requester?.user?.tag || "Unknown", inline: true }
        );
    
    channel.send({ embeds: [embed] }).catch(console.error);
});

// Event: Track end
client.aqua.on("trackEnd", (player, track) => {
    console.log(`[${player.guildId}] Track ended: ${track.info.title}`);
});

// Event: Track error
client.aqua.on("trackError", (player, track, error) => {
    console.error(`[${player.guildId}] Error playing track:`, error);
    
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) {
        channel.send(`❌ Error saat memutar **${track.info.title}**: ${error.message || 'Unknown error'}`);
    }
});

// Event: Node connect
client.aqua.on("nodeConnect", (node) => {
    console.log(`✅ Node terhubung: ${node.name}`);
});

// Event: Node error
client.aqua.on("nodeError", (node, error) => {
    console.error(`❌ Node "${node.name}" error: ${error.message}`);
});

// Event: Node disconnect
client.aqua.on("nodeDisconnect", (node) => {
    console.warn(`⚠️ Node terputus: ${node.name}`);
});

// Fungsi: Format waktu (ms -> HH:MM:SS)
function formatTime(ms) {
    if (!ms || isNaN(ms)) return "00:00";
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("Shutting down...");
    client.destroy();
    process.exit(0);
});

// Login bot
client.login(CONFIG.token).catch(error => {
    console.error("Failed to login:", error);
    process.exit(1);
});