import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswersCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract delete(questionComment: AnswerComment): Promise<void>
  abstract findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
