import { IConnectionRepository } from "@/core/repositories/IConnectionRepository";
import { Connection } from "@/core/entities/connection";

export class ConnectionUseCases {
  private connectionRepository: IConnectionRepository;

  constructor(connectionRepository: IConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async create(connection: Connection): Promise<Connection> {
    return await this.connectionRepository.create(connection);
  }

  async getById(id: string): Promise<Connection | null> {
    return await this.connectionRepository.getById(id);
  }

  getAll(onDataChanged: (connections: Connection[]) => void): void {
    this.connectionRepository.getAll(onDataChanged);
  }

  async update(id: string, connection: Connection): Promise<Connection> {
    return await this.connectionRepository.update(id, connection);
  }

  async delete(id: string): Promise<boolean> {
    return await this.connectionRepository.delete(id);
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.connectionRepository.getCount(onCountChanged);
  }
}