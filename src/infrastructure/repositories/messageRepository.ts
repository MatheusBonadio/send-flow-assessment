import { IMessageRepository } from '@/core/repositories/IMessageRepository';
import { Message } from '@/core/entities/message';
import { FirebaseFirestore } from '@/infrastructure/firebase/firestore';
import { onSnapshot, collection, doc, addDoc, getDoc, query, orderBy, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { ContactRepository } from './contactRepository';

export class MessageRepository implements IMessageRepository {
  private userId: string;
  private firestore: FirebaseFirestore;

  constructor(firestore: FirebaseFirestore, userId: string) {
    this.userId = userId;
    this.firestore = firestore;
  }

  private async messagesCollection() {
    const userId = await this.userId;
    return collection(this.firestore.db, `users/${userId}/messages`);
  }

  async create(message: Message): Promise<Message> {
    const messagesCol = await this.messagesCollection();
    
    const docRef = await addDoc(messagesCol, {
      id: uuidv4(),
      body: message.body,
      contactID: message.contactID,
      contactName: message.contactName,
      broadcastID: message.broadcastID,
      broadcastName: message.broadcastName,
      status: 'scheduled',
      scheduledAt: message.scheduledAt,
    });

    return new Message(
      docRef.id,
      message.body,
      message.contactID,
      message.broadcastID,
      message.broadcastName,
      'scheduled',
      message.scheduledAt
    );
  }

  async getById(id: string): Promise<Message | null> {
    const messagesCol = await this.messagesCollection();
    const docSnapshot = await getDoc(doc(messagesCol, id));

    if (!docSnapshot.exists()) return null;
    
    const data = docSnapshot.data();
    return new Message(
      id,
      data.body,
      data.contactID,
      data.broadcastID,
      data.broadcastName,
      data.status,
      data.scheduledAt.toDate(),
      data.contactName
    );
  }

  getAllScheduled(onDataChanged: (messages: Message[]) => void): void {
    this.messagesCollection().then((messagesCol) => {
      const queryScheduled = query(messagesCol, orderBy('scheduledAt', 'desc'), where('status', '==', 'scheduled'));
      const unsubscribe = onSnapshot(
        queryScheduled,
        async (snapshot) => {
          const messages = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              
              const contactRepository = new ContactRepository(this.firestore, this.userId);
              const contact = await contactRepository.getById(data.contactID);
              const contactName = contact ? contact.name : '';

              return new Message(
                doc.id,
                data.body,
                data.contactID,
                data.broadcastID,
                data.broadcastName,
                data.status,
                data.scheduledAt.toDate(),
                contactName
              );
            })
          );

          onDataChanged(messages);
        },
        (error) => {
          throw new Error('Erro ao buscar mensagens: ', error);
        }
      );

      return unsubscribe;
    });
  }

  getAllSent(onDataChanged: (messages: Message[]) => void): void {
    this.messagesCollection().then((messagesCol) => {
      const querySent = query(messagesCol, orderBy('scheduledAt', 'desc'), where('status', '==', 'sent'));
      const unsubscribe = onSnapshot(
        querySent,
        async (snapshot) => {
          const messages = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              
              const contactRepository = new ContactRepository(this.firestore, this.userId);
              const contact = await contactRepository.getById(data.contactID);
              const contactName = contact ? contact.name : '';

              return new Message(
                doc.id,
                data.body,
                data.contactID,
                data.broadcastID,
                data.broadcastName,
                data.status,
                data.scheduledAt.toDate(),
                contactName
              );
            })
          );

          onDataChanged(messages);
        },
        (error) => {
          throw new Error('Erro ao buscar mensagens: ', error);
        }
      );

      return unsubscribe;
    });
  }

  getCountScheduled(onCountChanged: (count: number) => void): void {
    this.messagesCollection().then((messagesCol) => {
      const queryScheduled = query(messagesCol, where('status', '==', 'scheduled'));
      const unsubscribe = onSnapshot(
        queryScheduled,
        (snapshot) => {
          onCountChanged(snapshot.size);
        },
        (error) => {
          onCountChanged(0);
          throw new Error('Erro ao contar mensagens: ', error);
        }
      );

      return unsubscribe;
    });
  }

  getCountSent(onCountChanged: (count: number) => void): void {
    this.messagesCollection().then((messagesCol) => {
      const querySent = query(messagesCol, where('status', '==', 'sent'));
      const unsubscribe = onSnapshot(
        querySent,
        (snapshot) => {
          onCountChanged(snapshot.size);
        },
        (error) => {
          onCountChanged(0);
          throw new Error('Erro ao contar mensagens: ', error);
        }
      );

      return unsubscribe;
    });
  }
}
