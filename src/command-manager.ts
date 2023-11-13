import path from 'path';
import { getDirectoryName, importDirectory } from './util.js';
import { Collection } from 'discord.js';
import { Client } from './bot.js';
import { ExecutableSlashCommand } from './types.js';

const __dirname = getDirectoryName(import.meta);
const commands: Collection<string, ExecutableSlashCommand> = new Collection();
await importDirectory(path.join(__dirname, "./commands"))
    .then(imports => imports.map(i => i.default))
    .then(imports => imports.forEach(i => commands.set(i.data.name, i)))
    .catch(() => { });
    
export function getCommands() {
    return commands;
}

Client.once("interactionCreate", async interaction => {
    if (!interaction.isCommand() || !interaction.isChatInputCommand())
        return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`Command '${interaction.commandName}' does not exist.`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true })
    }
})