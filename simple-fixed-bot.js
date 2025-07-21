/**
 * Simple YouTube Music Bot - Fixed Version
 * 
 * Versi sederhana yang memperbaiki error "Class constructor Aqua cannot be invoked without 'new'"
 */

const { Aqua } = require("aqualink");
const { Client, GatewayIntentBits } = require("discord.js");

// Konfigurasi
const nodes = [
    {
        host: "127.0.0.1",        // Ganti dengan IP Lavalink server
        password: "youshallnotpass", // Ganti dengan password Lavalink
        port: 2333,               // Ganti dengan port Lavalink
        secure: false,
        name: "main-node"
    }
];

// Inisialisasi client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// PENTING: Aqua adalah class, jadi harus digunakan dengan 'new'
const aqua = new Aqua(client, nodes, {
    defaultSearchPlatform: "ytsearch",
    restVersion: "v4",
    autoResume: false,
    infiniteReconnects: true,
});

client.aqua = aqua;

// Event: Bot siap
client.once("ready", () => {
    console.log(`Bot siap! Login sebagai ${client.user.tag}`);
    client.aqua.init(client.user.id);
});

// Event: Update voice state untuk Lavalink
client.on("raw", (d) => {
    if (d.t === "VOICE_STATE_UPDATE" || d.t === "VOICE_SERVER_UPDATE") {
        client.aqua.updateVoiceState(d);
    }
});

// Event: Pesan baru
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith("!play")) return;

    const query = message.content.slice(6);
    if (!query) return message.reply("Berikan query untuk diputar.");

    try {
        const player = client.aqua.createConnection({
            guildId: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            deaf: true,
        });

        const resolve = await client.aqua.resolve({ 
            query, 
            requester: message.member 
        });

        if (resolve.loadType === 'playlist' || resolve.loadType === 'PLAYLIST_LOADED') {
            for (const track of resolve.tracks) {
                player.queue.add(track);
            }
            message.reply(`Ditambahkan ${resolve.tracks.length} lagu dari playlist ${resolve.playlistInfo.name}.`);
            if (!player.playing && !player.paused) player.play();
        } 
        else if (resolve.loadType === 'search' || resolve.loadType === 'track' || 
                 resolve.loadType === 'TRACK_LOADED' || resolve.loadType === 'SEARCH_RESULT') {
            const track = resolve.tracks[0];
            player.queue.add(track);
            message.reply(`Ditambahkan **${track.info.title}** ke antrian.`);
            if (!player.playing && !player.paused) player.play();
        } 
        else {
            message.reply("Tidak ditemukan hasil untuk query tersebut.");
        }
    } catch (error) {
        console.error("Error:", error);
        message.reply(`Error: ${error.message}`);
    }
});

// Event: Node connect
client.aqua.on("nodeConnect", (node) => {
    console.log(`Node terhubung: ${node.name}`);
});

// Event: Node error
client.aqua.on("nodeError", (node, error) => {
    console.error(`Node "${node.name}" error: ${error.message}`);
});

// Login bot
client.login("TOKEN_BOT_ANDA_DISINI");