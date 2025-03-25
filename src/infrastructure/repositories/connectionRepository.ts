import { IConnectionRepository } from "@/core/repositories/IConnectionRepository";
import { Connection } from "@/core/entities/connection";
import { FirebaseFirestore } from "@/infrastructure/firebase/firestore";
import { onSnapshot, collection, doc, addDoc, getDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export class ConnectionRepository implements IConnectionRepository {
  private userId: string;
  private firestore: FirebaseFirestore;

  constructor(firestore: FirebaseFirestore, userId: string) {
    this.userId = userId;
    this.firestore = firestore;
  }

  private async connectionsCollection() {
    const userId = await this.userId;
    return collection(this.firestore.db, `users/${userId}/connections`);
  }

  async create(connection: Connection): Promise<Connection> {
    const connectionsCol = await this.connectionsCollection();
    
    const docRef = await addDoc(connectionsCol, {
      id: uuidv4(),
      name: connection.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Connection(docRef.id, connection.name);
  }

  async getById(id: string): Promise<Connection | null> {
    const connectionsCol = await this.connectionsCollection();
    const docSnapshot = await getDoc(doc(connectionsCol, id));

    if (!docSnapshot.exists()) return null;
    
    const data = docSnapshot.data();
    return new Connection(id, data?.name || "");
  }

  getAll(onDataChanged: (connections: Connection[]) => void): void {
    this.connectionsCollection().then((connectionsCol) => {
      const queryWithOrder = query(connectionsCol, orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(
        queryWithOrder,
        (snapshot) => {
          const connections = snapshot.docs.map((doc) => {
            const data = doc.data();
            return new Connection(doc.id, data.name);
          });
          onDataChanged(connections);
        },
        (error) => {
          throw new Error("Erro ao buscar conexões: ", error);
        }
      );

      return unsubscribe;
    });
  }

  async update(id: string, connection: Connection): Promise<Connection> {
    const connectionsCol = await this.connectionsCollection();
    await updateDoc(doc(connectionsCol, id), {
      name: connection.name,
      updatedAt: new Date(),
    });
    return connection;
  }

  async delete(id: string): Promise<boolean> {
    const connectionsCol = await this.connectionsCollection();
    await deleteDoc(doc(connectionsCol, id));
    return true;
  }

  getCount(onCountChanged: (count: number) => void): void {
    this.connectionsCollection().then((connectionsCol) => {
      const unsubscribe = onSnapshot(
        connectionsCol,
        (snapshot) => {
          onCountChanged(snapshot.size);
        },
        (error) => {
          onCountChanged(0);
          throw new Error("Erro ao contar conexões: ", error);
        }
      );

      return unsubscribe;
    });
  }
}
