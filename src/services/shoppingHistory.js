import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../config/firebase';

export const saveToHistory = async (item) => {
  try {
    const historyRef = ref(db, 'shopping-history');
    await push(historyRef, {
      ...item,
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans l\'historique:', error);
  }
};
