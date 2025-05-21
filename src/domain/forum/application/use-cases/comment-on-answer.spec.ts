import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let commentOnQuestionUseCase: CommentOnAnswerUseCase

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    commentOnQuestionUseCase = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswersCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await commentOnQuestionUseCase.execute({
      authorId: question.authorId.toString(),
      answerId: question.id.toString(),
      content: 'novo comentário',
    })

    console.log(inMemoryAnswersCommentsRepository.items[0])

    expect(inMemoryAnswersCommentsRepository.items[0].content).toEqual(
      'novo comentário',
    )
  })
})
