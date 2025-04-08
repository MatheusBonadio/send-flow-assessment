import { IBroadcastRepository } from '@/core/repositories/IBroadcastRepository';
import { ConnectionRepository } from '@/infrastructure/repositories/connectionRepository';
import { Broadcast } from '@/core/entities/broadcast';
import { FirebaseFirestore } from '@/lib/firebase';
import {
  onSnapshot,
  collection,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { MessageRepository } from './messageRepository';

export class BroadcastRepository implements IBroadcastRepository {
  private userId: string;
  private firestore: FirebaseFirestore;

  constructor(firestore: FirebaseFirestore, userId: string) {
    this.userId = userId;
    this.firestore = firestore;
  }

  private async broadcastsCollection() {
    const userId = await this.userId;
    return collection(this.firestore.db, `users/${userId}/broadcasts`);
  }

  async create(broadcast: Broadcast): Promise<Broadcast> {
    const broadcastsCol = await this.broadcastsCollection();

    const docRef = await addDoc(broadcastsCol, {
      id: uuidv4(),
      name: broadcast.name,
      scheduledAt: broadcast.scheduledAt,
      body: broadcast.body,
      connectionID: broadcast.connectionID,
      contactsIDs: broadcast.contactsIDs,
      createdAt: new Date(),
    });

    const messageRepository = new MessageRepository(
      this.firestore,
      this.userId,
    );

    for (const contactId of broadcast.contactsIDs) {
      await messageRepository.create({
        id: '',
        body: broadcast.body,
        contactID: contactId,
        contactName: '',
        broadcastID: docRef.id,
        broadcastName: broadcast.name,
        status: 'scheduled',
        scheduledAt: broadcast.scheduledAt,
      });
    }

    return new Broadcast(
      docRef.id,
      broadcast.name,
      broadcast.scheduledAt,
      broadcast.body,
      broadcast.connectionID,
      broadcast.contactsIDs,
    );
  }

  async getById(id: string): Promise<Broadcast | null> {
    const broadcastsCol = await this.broadcastsCollection();
    const docSnapshot = await getDoc(doc(broadcastsCol, id));

    if (!docSnapshot.exists()) return null;

    const data = docSnapshot.data();
    return new Broadcast(
      id,
      data.name,
      data.scheduledAt,
      data.body,
      data.connectionID,
      data.contactsIDs,
    );
  }

  getAll(onDataChanged: (broadcasts: Broadcast[]) => void): void {
    this.broadcastsCollection().then((broadcastsCol) => {
      const queryWithOrder = query(broadcastsCol, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(
        queryWithOrder,
        async (snapshot) => {
          const broadcasts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();

              const connectionRepository = new ConnectionRepository(
                this.firestore,
                this.userId,
              );
              const connection = await connectionRepository.getById(
                data.connectionID,
              );
              const connectionName = connection ? connection.name : '';

              return new Broadcast(
                doc.id,
                data.name,
                data.scheduledAt.toDate(),
                data.body,
                data.connectionID,
                data.contactsIDs,
                connectionName,
              );
            }),
          );

          onDataChanged(broadcasts);
        },
        (error) => {
          throw new Error('Erro ao buscar transmissões: ' + error);
        },
      );

      return unsubscribe;
    });
  }

  async delete(id: string): Promise<boolean> {
    const broadcastsCol = await this.broadcastsCollection();
    await deleteDoc(doc(broadcastsCol, id));
    return true;
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.broadcastsCollection().then((broadcastsCol) => {
      const unsubscribe = onSnapshot(
        broadcastsCol,
        (snapshot) => {
          onCountChanged(snapshot.size);
        },
        (error) => {
          onCountChanged(0);
          throw new Error('Erro ao contar transmissões: ' + error);
        },
      );

      return unsubscribe;
    });
  }
}
