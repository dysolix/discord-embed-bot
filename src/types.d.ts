import type { ChatInputCommandInteraction, ApplicationCommandDataResolvable, CacheType, BaseInteraction, CommandInteraction } from "discord.js";

declare global {
    type MaybePromise<T> = Promise<T> | T

    type ExecutableSlashCommand = {
        data: ApplicationCommandDataResolvable & { name: string}
    } & { execute: SlashCommandExecuteFunction }

    type SlashCommandExecuteFunction = (interaction: ChatInputCommandInteraction<CacheType>) => MaybePromise<void>

    type BotConfig = {
        embedLinkMap: Record<string, string>
        deleteOriginalMessage: boolean
        deleteLinkOnlyOriginalMessage: boolean
        mentionOriginalSender: boolean
    }
}