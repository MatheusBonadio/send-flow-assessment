import { Connection } from "@/core/entities/connection";

export interface IConnectionRepository {
    create(connection: Connection): Promise<Connection>;
    getById(id: string): Promise<Connection | null>;
    getAll(onDataChanged: (connections: Connection[]) => void): void;
    update(id: string, connection: Connection): Promise<Connection>;
    delete(id: string): Promise<boolean>;
    getCount(onCountChanged: (count: number) => void): void;
}
