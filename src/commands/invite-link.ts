import { createSlashCommand } from "../util.js";

export default createSlashCommand({ name: "invite", description: "Get the invite link for the bot" }, async (interaction) => {
    await interaction.reply({ content: "", ephemeral: true });
});