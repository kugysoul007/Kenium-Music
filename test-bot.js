// If you're using Module, use this:
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

//const { Aqua } = require('aqualink');

const { Aqua } = require("aqualink");
const { Client, Collection, GatewayDispatchEvents } = require("discord.js");

const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "MessageContent",
        "GuildVoiceStates"
    ]
});

// Ganti dengan konfigurasi Lavalink server Anda
const nodes = [
    {
        host: "IP_LAVALINK_SERVER_ANDA", // Misalnya "127.0.0.1" jika di mesin yang sama
        password: "PASSWORD_LAVALINK_ANDA", // Password yang dikonfigurasi di application.yml
        port: PORT_LAVALINK_ANDA, // Misalnya 2333 (port default Lavalink)
        secure: false, // Ganti menjadi true jika menggunakan SSL/HTTPS
        name: "main-node"
    }
];

// Aqua adalah class, jadi harus digunakan dengan 'new'
const aqua = new Aqua(client, nodes, {
  defaultSearchPlatform: "ytsearch",
  restVersion: "v4",
  autoResume: false,
  infiniteReconnects: true,
});

client.aqua = aqua;


client.once("ready", () => {
    client.aqua.init(client.user.id);
    console.log("Ready!");
});


client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
    client.aqua.updateVoiceState(d);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith("!play")) return;

    const query = message.content.slice(6);

    const player = client.aqua.createConnection({
        guildId: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        deaf: true,
    });

    const resolve = await client.aqua.resolve({ query, requester: message.member });

    // Log the resolve result to debug
    console.log("Resolve result:", JSON.stringify(resolve, null, 2));

    if (resolve.loadType === 'playlist' || resolve.loadType === 'PLAYLIST_LOADED') {
        await message.channel.send(`Added ${resolve.tracks.length} songs from ${resolve.playlistInfo.name} playlist.`);
        for (const track of resolve.tracks) {
            player.queue.add(track)
        }
        if (!player.playing && !player.paused) return player.play();

    } else if (resolve.loadType === 'search' || resolve.loadType === 'track' || 
               resolve.loadType === 'TRACK_LOADED' || resolve.loadType === 'SEARCH_RESULT') {
        const track = resolve.tracks.shift();
        track.info.requester = message.member;

        player.queue.add(track);

        await message.channel.send(`Added **${track.info.title}** to the queue.`);

        if (!player.playing && !player.paused) return player.play();

    } else if (resolve.loadType === 'LOAD_FAILED') {
        return message.channel.send(`Error loading track: ${resolve.exception?.message || 'Unknown error'}`);
    } else if (resolve.loadType === 'NO_MATCHES') {
        return message.channel.send(`There were no results found for your query.`);
    } else {
        console.log(`Unknown loadType: ${resolve.loadType}`);
        return message.channel.send(`There were no results found for your query.`);
    }
});

// Add event listeners for track events
client.aqua.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send(`Now playing: **${track.info.title}**`);
});

client.aqua.on("trackEnd", (player, track) => {
    console.log(`Track ended: ${track.info.title}`);
});

client.aqua.on("trackError", (player, track, error) => {
    console.error(`Error playing track ${track.info.title}:`, error);
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send(`Error playing **${track.info.title}**: ${error.message || 'Unknown error'}`);
});

client.aqua.on("nodeConnect", (node) => {
    console.log(`Node connected: ${node.name}`);
});

client.aqua.on("nodeError", (node, error) => {
    console.log(`Node "${node.name}" encountered an error: ${error.message}.`);
});

// Ganti dengan token bot yang sudah ada di server Anda
client.login("TOKEN_BOT_ANDA_DISINI");