import { Events } from "discord.js";
import { Client } from "../bot.js";
import config from "../config.json" assert { type: "json" };

Client.on(Events.MessageCreate, async message => {
    const embedTargetLinks: string[] = [];
    const messageLines = message.content.split("\n");
    for (const i in messageLines) {
        const line = messageLines[i];
        const msgParts = line.split(" ");
        for (const msgPartIndex in msgParts) {
            const msgPart = msgParts[msgPartIndex];
            try {
                const url = new URL(msgPart);
                const urlSplit = url.hostname.split(".");
                const domain = urlSplit.at(-2) + "." + urlSplit.at(-1);
                const [targetDomain, replaceDomain] = Object.entries(config.embedLinkMap).find(([x, y]) => domain === x) as [string, string] ?? [null, null];
                if (replaceDomain) {
                    embedTargetLinks.push(`https://${replaceDomain}${url.pathname}`);
                    msgParts[msgPartIndex] = `https://${replaceDomain}${url.pathname}`;
                    continue;
                }
            } catch { }
        }

        messageLines[i] = msgParts.join(" ");
    }

    if (embedTargetLinks.length === 0)
        return;

    if (config.deleteOriginalMessage)
        await message.delete();

    const finalMessage = messageLines.join("\n");

    if(config.includeOriginalMessage) {
        await message.channel.send({
            content: (config.mentionOriginalMessageAuthor ? `<@${message.author.id}> | ` : "") + finalMessage
        });
    } else {
        await message.channel.send({
            content: (config.mentionOriginalMessageAuthor ? `<@${message.author.id}>\n` : "") + embedTargetLinks.join("\n")
        });
    }
})