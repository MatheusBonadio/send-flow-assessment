import { IContactRepository } from "@/core/repositories/IContactRepository";
import { Contact } from "@/core/entities/contact";

export class ContactUseCases {
  private contactRepository: IContactRepository;

  constructor(contactRepository: IContactRepository) {
    this.contactRepository = contactRepository;
  }

  async create(contact: Contact): Promise<Contact> {
    return await this.contactRepository.create(contact);
  }

  async getById(id: string): Promise<Contact | null> {
    return await this.contactRepository.getById(id);
  }

  getAll(onDataChanged: (contacts: Contact[]) => void): void {
    this.contactRepository.getAll(onDataChanged);
  }

  async update(id: string, contact: Contact): Promise<Contact> {
    return await this.contactRepository.update(id, contact);
  }

  async delete(id: string): Promise<boolean> {
    return await this.contactRepository.delete(id);
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.contactRepository.getCount(onCountChanged);
  }
}