import { IMessageRepository } from "@/core/repositories/IMessageRepository";
import { Message } from "@/core/entities/message";

export class MessageUseCases {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async create(message: Message): Promise<Message> {
    return await this.messageRepository.create(message);
  }

  async getById(id: string): Promise<Message | null> {
    return await this.messageRepository.getById(id);
  }

  getAllScheduled(onDataChanged: (messages: Message[]) => void): void {
    this.messageRepository.getAllScheduled(onDataChanged);
  }

  getAllSent(onDataChanged: (messages: Message[]) => void): void {
    this.messageRepository.getAllSent(onDataChanged);
  }

  getCountScheduled(onCountChanged: (count: number) => void): void {
    this.messageRepository.getCountScheduled(onCountChanged);
  }

  getCountSent(onCountChanged: (count: number) => void): void {
    this.messageRepository.getCountSent(onCountChanged);
  }
}