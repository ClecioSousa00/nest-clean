import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }

  delete(questionComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
}
