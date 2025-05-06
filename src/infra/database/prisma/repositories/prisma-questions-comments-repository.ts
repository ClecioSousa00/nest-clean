import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionsCommentsRepository
  implements QuestionsCommentsRepository
{
  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }

  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
}
