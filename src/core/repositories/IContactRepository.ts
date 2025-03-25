import { Contact } from "@/core/entities/contact";

export interface IContactRepository {
    create(contact: Contact): Promise<Contact>;
    getById(id: string): Promise<Contact | null>;
    getAll(onDataChanged: (contacts: Contact[]) => void): void;
    update(id: string, contact: Contact): Promise<Contact>;
    delete(id: string): Promise<boolean>;
    getCount(onCountChanged: (count: number) => void): void;
}
