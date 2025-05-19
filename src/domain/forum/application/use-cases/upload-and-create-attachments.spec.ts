import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentsUseCase } from './upload-and-creat-attachment'
import { FakeUploader } from 'test/storage/faker-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let uploadAndCreateAttachments: UploadAndCreateAttachmentsUseCase

describe('Upload and Create attachment Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    uploadAndCreateAttachments = new UploadAndCreateAttachmentsUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload and create attachment', async () => {
    const result = await uploadAndCreateAttachments.execute({
      fileName: 'image.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'image.png',
      }),
    )
  })
  it('should not be able to upload attachment with invalid file type', async () => {
    const result = await uploadAndCreateAttachments.execute({
      fileName: 'audio.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
