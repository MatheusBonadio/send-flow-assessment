import { db, doc, getDoc, setDoc } from '@/infraestructure/firebase/firebase';
import { authConfig } from '@/infraestructure/config/serverConfig';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';

export const getAuthenticatedUserTokens = async () => {
  try {
    const tokens = await getTokens(await cookies(), authConfig);

    if (!tokens) throw new Error("Usuário não autenticado.");

    return tokens;
  } catch {
    throw new Error("Não foi possível obter os tokens do usuário autenticado");
  }
};


export const checkAndUpdateUserDocument = async (userId: string) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (!userData || Object.keys(userData).length === 0) {
                await setDoc(userDocRef, { id: userId }, { merge: true });
            }
        } else {
            await setDoc(userDocRef, { id: userId });
        }
    } catch {
        throw new Error("Não foi possível verificar/atualizar o documento do usuário");
    }
};
