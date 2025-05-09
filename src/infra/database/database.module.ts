import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository'
import { PrismaQuestionsCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionsCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswersCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionsCommentsRepository,
    QuestionsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswersCommentsRepository,
  ],
})
export class DatabaseModule {}
