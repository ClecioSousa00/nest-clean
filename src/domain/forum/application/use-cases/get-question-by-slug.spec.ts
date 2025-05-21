import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let getQuestionBySlug: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    getQuestionBySlug = new GetQuestionBySlugUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to get question by slug', async () => {
    const student = makeStudent({ name: 'john doe' })

    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({
      slug: Slug.create('test-question'),
      authorId: student.id,
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'some attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await getQuestionBySlug.execute({
      slug: 'test-question',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'john doe',
        attachments: [
          expect.objectContaining({
            title: 'some attachment',
          }),
        ],
      }),
    })
  })
})
