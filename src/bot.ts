import { Client as DiscordClient, Events, REST, Routes } from "discord.js";
import { getDirectoryName, importDirectory } from "./util.js";
import path from "path";

const APPLICATION_ID = process.env["APPLICATION_ID"] ?? "";
const TOKEN = process.env["DISCORD_TOKEN"];
if (!TOKEN)
    throw new Error("Environment variable 'DISCORD_TOKEN' is missing.");

const rest = new REST().setToken(TOKEN);
export const Client = new DiscordClient({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent"
    ]
});

Client.once(Events.ClientReady, async c => {
    const { getCommands } = await import("./command-manager.js")

    await rest.put(
        Routes.applicationCommands(APPLICATION_ID),
        { body: getCommands().map(cmd => cmd.data) },
    );

    await importDirectory(path.join(getDirectoryName(import.meta), "./message_handlers"));
});

await Client.login(TOKEN);