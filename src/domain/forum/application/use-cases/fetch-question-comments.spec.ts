import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let fetchRecentQuestionsUseCase: FetchQuestionCommentsUseCase

describe('Fetch Questions Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    fetchRecentQuestionsUseCase = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to fetch  questions comments', async () => {
    const student = makeStudent({ name: 'john doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)

    await inMemoryQuestionCommentsRepository.create(comment2)

    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 1,
      questionId: 'question-1',
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
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
