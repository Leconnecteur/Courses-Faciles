import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebase';

class NotificationService {
  constructor() {
    this.messaging = getMessaging();
    // Remplacez cette ligne par votre clé VAPID que vous venez de générer
    this.vapidKey = 'sG1s-79jS3VGF6KSy21_5F7BdIx278pUtd2n6K9Cr-U';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await this.getToken();
        if (token) {
          await this.saveToken(token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  async getToken() {
    try {
      return await getToken(this.messaging, { vapidKey: this.vapidKey });
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  async saveToken(token) {
    try {
      const tokensRef = ref(db, 'notification_tokens');
      const snapshot = await get(tokensRef);
      const tokens = snapshot.val() || {};
      
      // Vérifier si le token existe déjà
      if (!Object.values(tokens).includes(token)) {
        const newTokenRef = ref(db, `notification_tokens/${Date.now()}`);
        await set(newTokenRef, token);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  }

  onMessageReceived(callback) {
    return onMessage(this.messaging, (payload) => {
      callback(payload);
    });
  }
}

export const notificationService = new NotificationService();
