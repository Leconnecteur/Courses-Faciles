import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebase';

class NotificationService {
  constructor() {
    this.messaging = getMessaging();
    this.vapidKey = 'sG1s-79jS3VGF6KSy21_5F7BdIx278pUtd2n6K9Cr-U';
  }

  getBrowserType() {
    // Détection du navigateur
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'safari';
    } else {
      return 'other';
    }
  }

  getStorageKey() {
    return `notificationPermissionRequested_${this.getBrowserType()}`;
  }

  async requestPermission() {
    try {
      const browserType = this.getBrowserType();
      const storageKey = this.getStorageKey();
      const hasRequestedPermission = localStorage.getItem(storageKey);
      
      // Si la permission a déjà été accordée
      if (Notification.permission === 'granted') {
        const token = await this.getToken();
        if (token) {
          await this.saveToken(token, browserType);
          return true;
        }
        return false;
      }
      
      // Si on a déjà demandé la permission et qu'elle a été refusée
      if (hasRequestedPermission && Notification.permission === 'denied') {
        return false;
      }
      
      // Si on n'a jamais demandé la permission
      if (!hasRequestedPermission) {
        const permission = await Notification.requestPermission();
        localStorage.setItem(storageKey, 'true');
        
        if (permission === 'granted') {
          const token = await this.getToken();
          if (token) {
            await this.saveToken(token, browserType);
            return true;
          }
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
      const currentToken = await getToken(this.messaging, { vapidKey: this.vapidKey });
      if (currentToken) {
        return currentToken;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  async saveToken(token, browserType) {
    try {
      const tokensRef = ref(db, 'notification_tokens');
      const snapshot = await get(tokensRef);
      const tokens = snapshot.val() || {};
      
      // Créer une clé unique qui inclut le type de navigateur
      const tokenKey = `${Date.now()}_${browserType}`;
      
      // Vérifier si le token existe déjà pour ce navigateur
      const existingTokenEntry = Object.entries(tokens).find(([key, value]) => 
        value.token === token && value.browser === browserType
      );
      
      if (!existingTokenEntry) {
        const newTokenRef = ref(db, `notification_tokens/${tokenKey}`);
        await set(newTokenRef, {
          token: token,
          browser: browserType,
          timestamp: Date.now()
        });
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
