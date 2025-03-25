import { Message } from "@/core/entities/message";

export interface IMessageRepository {
    create(message: Message): Promise<Message>;
    getById(id: string): Promise<Message | null>;
    getAllScheduled(onDataChanged: (messages: Message[]) => void): void;
    getAllSent(onDataChanged: (messages: Message[]) => void): void;
    getCountScheduled(onCountChanged: (count: number) => void): void;
    getCountSent(onCountChanged: (count: number) => void): void;
}
