"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const tenor_1 = require("./tenor");
const db = require("quick.db");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILDS] });
let guild;
const owner = "400029130219061260";
const channel = "945898504071565312";
let begin = false;
const end = 650;
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    guild = client.guilds.cache.get("945886916887330866");
    if (!guild)
        throw new Error("Guild not found!");
});
const prefix = "!";
client.on("messageCreate", async (message) => {
    if (!guild || message.guild.id !== guild.id || message.author.bot || !message.content.startsWith(prefix))
        return;
    const command = message.content.substring(1).split(" ")[0].toLowerCase();
    if (!command || command.length === 0)
        return;
    const args = message.content.substring(2 + command.length).toLowerCase().split(" ");
    switch (command) {
        case "begin":
            if (message.author.id !== owner) {
                message.reply("⛔ | You don't have access to that command!");
                return;
            }
            if (begin !== false) {
                message.reply("⛔ | Begin is already running!");
                return;
            }
            begin = setInterval(async () => {
                let current = db.get("currentRule");
                if (!current || typeof current !== "number") {
                    db.set("currentRule", 0);
                    current = 0;
                }
                if (current > end) {
                    if (!begin)
                        return;
                    clearInterval(begin);
                    begin = false;
                    return;
                }
                const gif = await (0, tenor_1.default)(`rule ${current}`);
                message.channel.send(gif);
                db.set("currentRule", current + 1);
            }, 3000);
            message.reply("👍 | Starting!");
            break;
        case "stop":
            if (message.author.id !== owner) {
                message.reply("⛔ | You don't have access to that command!");
                return;
            }
            if (begin === false) {
                message.reply("⛔ | Begin isn't running!");
                return;
            }
            clearInterval(begin);
            begin = false;
            message.reply("👍 | Stopped");
            break;
        case "setrule":
            if (message.author.id !== owner) {
                message.reply("⛔ | You don't have access to that command!");
                return;
            }
            if (begin !== false) {
                message.reply("⛔ | Begin is already running!");
                return;
            }
            if (!args[0]) {
                message.reply("⛔ | Missing arg0: `rule to set to`!");
                return;
            }
            if (isNaN(args[0])) {
                message.reply(`⛔ | \`${args[0]}\` is not a number!`);
                return;
            }
            db.set("currentRule", parseInt(args[0]));
            message.reply(`👍 | Set currentRule to ${args[0]}!`);
            break;
        case "editrule":
            if (message.author.id !== owner) {
                message.reply("⛔ | You don't have access to that command!");
                return;
            }
            if (!args[0]) {
                message.reply("⛔ | Missing arg0: `message id to edit`!");
                return;
            }
            if (!args[1]) {
                message.reply("⛔ | Missing arg1: `new message content`!");
                return;
            }
            if (isNaN(args[0])) {
                message.reply(`⛔ | ${args[0]} is not a number!`);
                return;
            }
            const rulesChannel = guild.channels.cache.get(channel);
            if (!rulesChannel) {
                message.reply("⛔ | Channel doesn't exist!");
                return;
            }
            if (rulesChannel.type !== "GUILD_TEXT") {
                message.reply("⛔ | Channel isn't a text channel!");
                return;
            }
            const ruleMessage = await rulesChannel.messages.fetch(args[0]);
            if (!ruleMessage) {
                message.reply(`⛔ | Message with id of \`${args[0]}\` was not found!`);
                return;
            }
            ruleMessage.edit(args[1]).catch((error) => {
                message.reply(`⛔ | An error has occurred! \`${error}\``);
            });
            message.reply("👍 | Done!");
            break;
    }
});
client.login(config_1.default.token);
//# sourceMappingURL=index.js.map