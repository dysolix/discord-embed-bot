import fs from 'fs/promises';
import path from 'path';
import { getDirectoryName } from './util.js';
import { Collection } from 'discord.js';
import { Client } from './bot.js';

const __dirname = getDirectoryName(import.meta);
const commandFiles = await fs.readdir(path.join(__dirname, "./commands"), { withFileTypes: true }).then(entries => entries.filter(e => e.isFile()).map(e => e.name), err => []);
const commands: Collection<string, ExecutableSlashCommand> = new Collection();
for (const fileName of commandFiles) {
    const command = await import(`./commands/${fileName}`).then(m => m.default) as ExecutableSlashCommand;
    commands.set(command.data.name, command);
}

export function getCommands() {
    return commands;
}

Client.once("interactionCreate", async interaction => {
    if (!interaction.isCommand())
        return;
})