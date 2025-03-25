import { IUserRepository } from "@/core/repositories/IUserRepository";
import { User } from "@/core/entities/user";

export class UserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.create(user);
  }
}