import fs from 'fs/promises';
import path from 'path';
import { getDirectoryName } from './util.js';
import { ChatInputCommandInteraction, Collection } from 'discord.js';
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