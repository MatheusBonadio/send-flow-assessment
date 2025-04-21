import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateMessageStatus = onSchedule(
  'every 1 minutes',
  async (event) => {
    const firestore = admin.firestore();
    const now = new Date();

    const messagesRef = firestore.collection('messages');

    try {
      const query = messagesRef
        .where('status', '==', 'scheduled')
        .where('scheduledAt', '<=', now);

      const messagesSnapshot = await query.get();

      for (const messageDoc of messagesSnapshot.docs) {
        await messageDoc.ref.update({ status: 'sent' });
        console.log(`Mensagem ${messageDoc.id} atualizada para 'sent'`);
      }
    } catch (error) {
      console.error('Erro ao atualizar mensagens:' + error);
    }
  },
);
