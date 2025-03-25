import { User } from "@/core/entities/user";

export interface IUserRepository {
    create(broadcast: User): Promise<User>;
}
