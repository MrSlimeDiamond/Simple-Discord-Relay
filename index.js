const config = require("./config.json");
const Discord = require("discord.js");
const irc = require("irc");

var ircclient = new irc.Client(config.ircserver, config.ircnick, {
    channels: [config.channels],
});
var discordclient = new Discord.Client();

discordclient.login(config.discordtoken);

ircclient.addListener("message", (from, to, text, message) => {
    if (from == config.ircnick) return;
    discordclient.channels.cache.get(config.discordchannel).send(`[IRC] <${from}> ${text}`);
});

discordclient.on("message", function (message) {
    if (message.webhookID) return;
    if (message.author.id == config.discordbotid) return;
    if (message.channel.id == config.discordchannel) {
        ircclient.say(config.channels, `[DISCORD] <${message.author.tag}> ${message}`);
        return;
    }
});
