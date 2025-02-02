const { Client } = require("discord.js-selfbot-v13");

const client = new Client({ checkUpdate: false });

const config = require(`${process.cwd()}/config.json`);
const phrases = require(`${process.cwd()}/phrases.json`).phrases;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.get(config.Channel);

  if (!channel) {
    console.error(`Channel with ID ${config.Channel} not found.`);
    return;
  }

  await channel.send("I am ready");

  // Send a random phrase every 5 minutes
  setInterval(() => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    channel.send(randomPhrase);
  }, 3000); // 300000 ms = 5 minutes
});

client.on("error", (error) => {
  console.error("An error occurred:", error);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefix = "!"; // Replace with your preferred prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "mikumiku") {
    const channel = message.channel;

    // Send the initial phrase and then send each message sequentially
    try {
      await channel.send(
        "And now, it's time for the moment you've been waiting for!"
      );
      const messages = ["ONE", "TWO", "THREE", "READY!", "MİKU MİKU"];
      for (const msg of messages) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between messages
        await channel.send(msg);
      }

      // Send a GIF with the final message
      const gifUrl = "./miku.gif"; // Replace with the path to your GIF
      await channel.send({
        content: "BEEEEEEAAAAMMM!!",
        files: [gifUrl],
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      channel.send("I don't have permission to send messages.");
    }
  }

  if (command === "avatar") {
    const user = message.mentions.users.first() || message.author;
    return message.reply(
      `${user.tag}'s avatar: ${user.displayAvatarURL({ size: 1024, dynamic: true })}`
    );
  }

  if (command === "servericon") {
    if (!message.guild.iconURL()) {
      return message.reply("This server does not have an icon.");
    }
    return message.reply(
      `${message.guild.name}'s icon: ${message.guild.iconURL({ size: 1024, dynamic: true })}`
    );
  }

  if (command === "uptime") {
    const uptime = client.uptime; // In milliseconds
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    return message.reply(`Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`);
  }

  if (command === "ping") {
    const latency = Date.now() - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    return message.reply(
      `Pong! Latency: ${latency}ms | API Latency: ${apiLatency}ms`
    );
  }
});

client.login(config.Token || process.env.token);
