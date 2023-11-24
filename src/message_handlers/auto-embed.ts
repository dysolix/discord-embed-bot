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
                const [_, replaceDomain] = Object.entries(config.embedLinkMap).find(([key, value]) => {
                    return url.hostname.endsWith(key) && url.hostname !== value; 
                }) as [string, string] ?? [null, null];
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
    let sentMessage;

    if(config.includeOriginalMessage) {
        sentMessage = await message.channel.send({
            content: finalMessage + (config.mentionOriginalMessageAuthor ? ` | <@${message.author.id}>` : "") + (config.enableDeletion ? "\n\nYou have 30 seconds to react with ❌ to delete this message." : "")
        });
    } else {
        sentMessage = await message.channel.send({
            content: embedTargetLinks.join("\n") + (config.mentionOriginalMessageAuthor ? `\n<@${message.author.id}>` : "") + (config.enableDeletion ? "\n\nYou have 30 seconds to react with ❌ to delete this message." : "")
        });
    }

    if(!config.enableDeletion)
        return;

    await sentMessage.react("❌");
    const reactions = await sentMessage.awaitReactions({ filter: (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id, max: 1, time: 30000 });
    if(reactions.size > 0)
        await sentMessage.delete();
    else {
        await sentMessage.edit(sentMessage.content.replace("\n\nYou have 30 seconds to react with ❌ to delete this message.", ""));
        await sentMessage.reactions.cache.find(reaction => reaction.emoji.name === "❌")?.users.remove();
    }
})