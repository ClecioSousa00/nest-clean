import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let fetchRecentAnswerUseCase: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    fetchRecentAnswerUseCase = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to fetch  questions comments', async () => {
    const student = makeStudent({ name: 'john doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentsRepository.create(comment2)

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await fetchRecentAnswerUseCase.execute({
      page: 1,
      answerId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'john doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'john doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'john doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })
  it('should be able to fetch paginated questions comments', async () => {
    const student = makeStudent({ name: 'john doe' })

    inMemoryStudentsRepository.items.push(student)
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await fetchRecentAnswerUseCase.execute({
      page: 2,
      answerId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
