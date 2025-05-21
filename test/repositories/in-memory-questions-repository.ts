import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const slugQuestion = this.items.find((item) => item.slug.value === slug)

    if (!slugQuestion) return null

    return slugQuestion
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const slugQuestion = this.items.find((item) => item.slug.value === slug)

    if (!slugQuestion) return null

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(slugQuestion.authorId),
    )

    if (!author) {
      throw new Error(
        `Author with ID "${slugQuestion.authorId.toString()}" does not exist`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.id.equals(slugQuestion.id),
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(questionAttachment.id),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.id.toString()}" does not exist`,
        )
      }
      return attachment
    })

    return QuestionDetails.create({
      questionId: slugQuestion.id,
      authorId: slugQuestion.authorId,
      author: author.name,
      title: slugQuestion.title,
      slug: slugQuestion.slug,
      content: slugQuestion.content,
      bestAnswerId: slugQuestion.bestAnswerId,
      attachments,
      createdAt: slugQuestion.createdAt,
      updatedAt: slugQuestion.updatedAt,
    })
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    return question ?? null
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return questions
  }
}
