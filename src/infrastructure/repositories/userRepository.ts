import { IUserRepository } from '@/core/repositories/IUserRepository';
import { User } from '@/core/entities/user';
import { FirebaseFirestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export class UserRepository implements IUserRepository {
  private firestore: FirebaseFirestore;

  constructor(firestore: FirebaseFirestore) {
    this.firestore = firestore;
  }
  async create(user: User): Promise<User> {
    const docRef = doc(this.firestore.db, 'users', user.id);

    await setDoc(docRef, {
      email: user.email,
      createdAt: new Date(),
    });

    return new User(docRef.id, user.email);
  }
}
