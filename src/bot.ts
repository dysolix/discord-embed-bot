import { Client as DiscordClient, Events, REST, Routes } from "discord.js";
import { getDirectoryName, importDirectory } from "./util.js";
import path from "path";
import config from "./config.json" assert { type: "json" };

const __dirname = getDirectoryName(import.meta);

const APPLICATION_ID = process.env["APPLICATION_ID"] ?? config.applicationId;
if (!APPLICATION_ID)
    throw new Error("'APPLICATION_ID' is missing.");

const TOKEN = process.env["DISCORD_TOKEN"] ?? config.discordToken;
if (!TOKEN)
    throw new Error("'DISCORD_TOKEN' is missing.");

const rest = new REST().setToken(TOKEN);
export const Client = new DiscordClient({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        "GuildMessageReactions"
    ]
});

Client.once(Events.ClientReady, async c => {
    const { getCommands } = await import("./command-manager.js")

    await rest.put(
        Routes.applicationCommands(APPLICATION_ID),
        { body: getCommands().map(cmd => cmd.data) },
    );

    await importDirectory(path.join(__dirname, "./message_handlers"));
});

await Client.login(TOKEN);