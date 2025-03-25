import { useAlert } from '@/presentation/providers/AlertProvider';
import { UserRepository } from '@/infrastructure/repositories/userRepository';
import { FirebaseFirestore } from '@/infrastructure/firebase/firestore';
import { User } from '@/core/entities/user';
import { UserUseCases } from '@/core/useCases/userUseCase';

export const useUsers = () => {
  const { showAlert } = useAlert();

  const firestore = new FirebaseFirestore();
  const userRepository = new UserRepository(firestore);
  const userUseCases = new UserUseCases(userRepository);

  const addUser = async (userData: User) => {
    try {
      const newUser = await userUseCases.create({
        ...userData,
      } as User);
      
      showAlert('Usuário criado com sucesso!', 'success');
      return newUser;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } 
  };

  return {
    addUser
  };
};
