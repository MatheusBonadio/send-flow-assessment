import { IContactRepository } from "@/core/repositories/IContactRepository";
import { Contact } from "@/core/entities/contact";
import { FirebaseFirestore } from "@/infrastructure/firebase/firestore";
import { onSnapshot, collection, doc, addDoc, getDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export class ContactRepository implements IContactRepository {
  private userId: string;
  private firestore: FirebaseFirestore;

  constructor(firestore: FirebaseFirestore, userId: string) {
    this.userId = userId;
    this.firestore = firestore;
  }

  private async contactsCollection() {
    const userId = await this.userId;
    return collection(this.firestore.db, `users/${userId}/contacts`);
  }

  async create(contact: Contact): Promise<Contact> {
    const contactsCol = await this.contactsCollection();
    
    const docRef = await addDoc(contactsCol, {
      id: uuidv4(),
      name: contact.name,
      phone: contact.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return new Contact(docRef.id, contact.name, contact.phone);
  }

  async getById(id: string): Promise<Contact | null> {
    const contactsCol = await this.contactsCollection();
    const docSnapshot = await getDoc(doc(contactsCol, id));

    if (!docSnapshot.exists()) return null;
    
    const data = docSnapshot.data();
    return new Contact(id, data?.name || "", data?.phone || "");
  }

  getAll(onDataChanged: (contacts: Contact[]) => void): void {
    this.contactsCollection().then((contactsCol) => {
      const queryWithOrder = query(contactsCol, orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(
        queryWithOrder,
        (snapshot) => {
          const contacts = snapshot.docs.map((doc) => {
            const data = doc.data();
            return new Contact(doc.id, data.name, data.phone);
          });
          onDataChanged(contacts);
        },
        (error) => {
          throw new Error("Erro ao buscar contatos: ", error);
        }
      );

      return unsubscribe;
    });
  }

  async update(id: string, contact: Contact): Promise<Contact> {
    const contactsCol = await this.contactsCollection();
    await updateDoc(doc(contactsCol, id), {
      name: contact.name,
      phone: contact.phone,
      updatedAt: new Date().toISOString(),
    });
    return contact;
  }

  async delete(id: string): Promise<boolean> {
    const contactsCol = await this.contactsCollection();
    await deleteDoc(doc(contactsCol, id));
    return true;
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.contactsCollection().then((contactsCol) => {
      const unsubscribe = onSnapshot(
        contactsCol,
        (snapshot) => {
          onCountChanged(snapshot.size);
        },
        (error) => {
          onCountChanged(0);
          throw new Error("Erro ao contar contatos: ", error);
        }
      );

      return unsubscribe;
    });
  }
}
