import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { faker } from '@faker-js/faker'

export const makeQuestion = (
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) => {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      slug: Slug.create('test-question'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}
