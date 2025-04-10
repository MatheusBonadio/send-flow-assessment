import { useAlert } from '@/presentation/providers/AlertProvider';
import { FirebaseFirestore } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  email: string;
  createdAt?: Date;
};

export const useUsers = () => {
  const { showAlert } = useAlert();

  const addUser = async (userData: { id: string; email: string }) => {
    try {
      const firestore = new FirebaseFirestore();
      const userRef = doc(firestore.db, 'users', userData.id);

      await setDoc(userRef, {
        email: userData.email,
        createdAt: Timestamp.now(),
      });

      showAlert('Usuário criado com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  return {
    addUser,
  };
};
