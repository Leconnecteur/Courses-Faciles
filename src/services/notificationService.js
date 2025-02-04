import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebase';

class NotificationService {
  constructor() {
    this.messaging = getMessaging();
    this.vapidKey = 'sG1s-79jS3VGF6KSy21_5F7BdIx278pUtd2n6K9Cr-U';
  }

  getBrowserType() {
    const userAgent = navigator.userAgent;
    console.log('UserAgent:', userAgent);
    
    if (userAgent.indexOf("Chrome") != -1) {
      console.log('Navigateur détecté: Chrome');
      return 'chrome';
    } else if (userAgent.indexOf("Safari") != -1) {
      console.log('Navigateur détecté: Safari');
      return 'safari';
    } else {
      console.log('Navigateur détecté: Autre');
      return 'other';
    }
  }

  getStorageKey() {
    const key = `notificationPermissionRequested_${this.getBrowserType()}`;
    console.log('Storage key:', key);
    return key;
  }

  async requestPermission() {
    try {
      console.log('Début de la demande de permission');
      const browserType = this.getBrowserType();
      const storageKey = this.getStorageKey();
      const hasRequestedPermission = localStorage.getItem(storageKey);
      console.log('Permission déjà demandée?', hasRequestedPermission);
      console.log('Permission actuelle:', Notification.permission);
      
      if (Notification.permission === 'granted') {
        console.log('Permission déjà accordée, récupération du token');
        const token = await this.getToken();
        if (token) {
          console.log('Token obtenu, sauvegarde');
          await this.saveToken(token, browserType);
          return true;
        }
        console.log('Pas de token obtenu');
        return false;
      }
      
      if (hasRequestedPermission && Notification.permission === 'denied') {
        console.log('Permission déjà refusée');
        return false;
      }
      
      if (!hasRequestedPermission) {
        console.log('Première demande de permission');
        const permission = await Notification.requestPermission();
        console.log('Réponse à la demande:', permission);
        localStorage.setItem(storageKey, 'true');
        
        if (permission === 'granted') {
          console.log('Permission accordée, récupération du token');
          const token = await this.getToken();
          if (token) {
            console.log('Token obtenu, sauvegarde');
            await this.saveToken(token, browserType);
            return true;
          }
          console.log('Pas de token obtenu après permission');
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
      console.log('Tentative de récupération du token');
      const currentToken = await getToken(this.messaging, { vapidKey: this.vapidKey });
      if (currentToken) {
        console.log('Token récupéré:', currentToken.substring(0, 10) + '...');
        return currentToken;
      }
      console.log('Pas de token disponible');
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  async saveToken(token, browserType) {
    try {
      console.log('Sauvegarde du token pour', browserType);
      const tokensRef = ref(db, 'notification_tokens');
      const snapshot = await get(tokensRef);
      const tokens = snapshot.val() || {};
      
      const tokenKey = `${Date.now()}_${browserType}`;
      
      const existingTokenEntry = Object.entries(tokens).find(([key, value]) => 
        value.token === token && value.browser === browserType
      );
      
      if (!existingTokenEntry) {
        console.log('Nouveau token, sauvegarde en cours');
        const newTokenRef = ref(db, `notification_tokens/${tokenKey}`);
        await set(newTokenRef, {
          token: token,
          browser: browserType,
          timestamp: Date.now()
        });
        console.log('Token sauvegardé avec succès');
      } else {
        console.log('Token déjà existant pour ce navigateur');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  }

  onMessageReceived(callback) {
    return onMessage(this.messaging, (payload) => {
      console.log('Message reçu:', payload);
      callback(payload);
    });
  }
}

export const notificationService = new NotificationService();
