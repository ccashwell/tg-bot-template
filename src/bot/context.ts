import type { Update, UserFromGetMe } from '@grammyjs/types'
import { type Api, Context as DefaultContext, type SessionFlavor } from 'grammy'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { HydrateFlavor } from '@grammyjs/hydrate'
import type { I18nFlavor } from '@grammyjs/i18n'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Logger } from '#root/logger.js'
import type { Config } from '#root/config.js'
import type { PrismaClientX } from '#root/prisma/index.js'

export interface SessionData {
  // field?: string;
}

interface ExtendedContextFlavor {
  logger: Logger
  config: Config
  prisma: PrismaClientX
}

export type Context = ParseModeFlavor<
  HydrateFlavor<
    DefaultContext &
    ExtendedContextFlavor &
    SessionFlavor<SessionData> &
    I18nFlavor &
    AutoChatActionFlavor
  >
>

interface Dependencies {
  logger: Logger
  config: Config
  prisma: PrismaClientX
}

export function createContextConstructor(
  {
    logger,
    config,
    prisma,
  }: Dependencies,
) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    prisma: PrismaClientX
    logger: Logger
    config: Config

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me)

      this.logger = logger.child({
        update_id: this.update.update_id,
      })
      this.config = config
      this.prisma = prisma
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context
}
