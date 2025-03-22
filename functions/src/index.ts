import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateMessageStatus = onSchedule('every 1 minutes', async (event) => {
  const firestore = admin.firestore();
  const now = new Date();

  const usersRef = firestore.collection('users');

  try {
    const usersSnapshot = await usersRef.get();

    for (const userDoc of usersSnapshot.docs) {
      const messagesRef = userDoc.ref.collection('messages');

      const query = messagesRef
        .where('status', '==', 'scheduled')
        .where('scheduledAt', '<=', now);

      const messagesSnapshot = await query.get();

      for (const messageDoc of messagesSnapshot.docs) {
        await messageDoc.ref.update({ status: 'sent' });
        console.log(`Mensagem ${messageDoc.id} do usuário ${userDoc.id} atualizada para 'sent'`);
      }

      console.log(`Total de mensagens atualizadas para o usuário ${userDoc.id}: ${messagesSnapshot.size}`);
    }
  } catch (error) {
    console.error('Erro ao atualizar mensagens:', error);
  }
});
