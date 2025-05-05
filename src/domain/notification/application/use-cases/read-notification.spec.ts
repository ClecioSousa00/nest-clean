import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemorySendNotificationsRepository: InMemoryNotificationsRepository

let sendNotification: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    inMemorySendNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new ReadNotificationUseCase(
      inMemorySendNotificationsRepository,
    )
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemorySendNotificationsRepository.create(notification)

    const result = await sendNotification.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemorySendNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await inMemorySendNotificationsRepository.create(notification)

    const result = await sendNotification.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
