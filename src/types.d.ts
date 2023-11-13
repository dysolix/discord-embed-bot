import type { ChatInputCommandInteraction, ApplicationCommandDataResolvable, CacheType, BaseInteraction, CommandInteraction } from "discord.js";

export type MaybePromise<T> = Promise<T> | T

export type ExecutableSlashCommand = {
    data: ApplicationCommandDataResolvable & { name: string }
} & { execute: SlashCommandExecuteFunction }

export type SlashCommandExecuteFunction = (interaction: ChatInputCommandInteraction<CacheType>) => MaybePromise<void>