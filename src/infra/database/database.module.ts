import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository'
import { PrismaQuestionsCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },

    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },

    {
      provide: QuestionsCommentsRepository,
      useClass: PrismaQuestionsCommentsRepository,
    },

    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },

    {
      provide: AnswersRepository,
      useClass: PrismaAnswerRepository,
    },

    {
      provide: AnswersCommentsRepository,
      useClass: PrismaAnswersCommentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionsCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswersCommentsRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
