import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

let inMemorySendNotificationsRepository: InMemoryNotificationsRepository

let sendNotification: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemorySendNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemorySendNotificationsRepository,
    )
  })

  it('should be able to send a notification', async () => {
    const result = await sendNotification.execute({
      recipientId: '2',
      content: 'resposta',
      title: 'nova pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySendNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
