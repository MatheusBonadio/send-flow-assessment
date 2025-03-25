import { IBroadcastRepository } from "@/core/repositories/IBroadcastRepository";
import { Broadcast } from "@/core/entities/broadcast";

export class BroadcastUseCases {
  private broadcastRepository: IBroadcastRepository;

  constructor(broadcastRepository: IBroadcastRepository) {
    this.broadcastRepository = broadcastRepository;
  }

  async create(broadcast: Broadcast): Promise<Broadcast> {
    return await this.broadcastRepository.create(broadcast);
  }

  async getById(id: string): Promise<Broadcast | null> {
    return await this.broadcastRepository.getById(id);
  }

  getAll(onDataChanged: (broadcasts: Broadcast[]) => void): void {
    this.broadcastRepository.getAll(onDataChanged);
  }

  async delete(id: string): Promise<boolean> {
    return await this.broadcastRepository.delete(id);
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.broadcastRepository.getCount(onCountChanged);
  }
}