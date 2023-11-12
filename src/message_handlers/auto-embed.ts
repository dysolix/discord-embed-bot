import { Events } from "discord.js";
import { Client } from "../bot.js";
import config from "../config.json" assert { type: "json" };

Client.on(Events.MessageCreate, async message => {
    const msgParts = message.content.replace("\n", " ").split(" ");
    const embedTargetLinks: string[] = [];
    let shouldDelete = config.deleteLinkOnlyOriginalMessage;
    for(const msgPart of msgParts){
        try {
            const url = new URL(msgPart);
            const urlSplit = url.hostname.split(".");
            const domain = urlSplit.at(-2) + "." + urlSplit.at(-1);
            const [targetDomain, replaceDomain] = Object.entries(config.embedLinkMap).find(([x, y]) => domain === x) as [string, string] ?? [null, null];
            if(replaceDomain) {
                embedTargetLinks.push(`https://${replaceDomain}${url.pathname}`);
                continue;
            }
        } catch { }

        if(!config.deleteOriginalMessage)
            shouldDelete = false;
    }

    if(embedTargetLinks.length === 0)
        return;

    if(shouldDelete) 
        await message.delete();

    await message.channel.send({ content: (config.mentionOriginalSender ? `<@${message.author.id}>\n\n` : "") + embedTargetLinks.join("\n") });
})