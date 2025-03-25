import { Broadcast } from "@/core/entities/broadcast";

export interface IBroadcastRepository {
    create(broadcast: Broadcast): Promise<Broadcast>;
    getById(id: string): Promise<Broadcast | null>;
    getAll(onDataChanged: (broadcasts: Broadcast[]) => void): void;
    delete(id: string): Promise<boolean>;
    getCount(onCountChanged: (count: number) => void): void;
}
