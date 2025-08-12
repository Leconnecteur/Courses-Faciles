import { ref, set, get } from 'firebase/database';
import { db, vapidKey, messaging as mockMessaging, initializeMessaging } from '../config/firebase';

// Déterminer si nous sommes en environnement de développement
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168');

class NotificationService {
  constructor() {
    this.isDevelopment = isDevelopment;
    this.vapidKey = vapidKey;
    this.messaging = null;
    this.messagingPromise = null;
    
    // Initialiser Firebase Messaging de manière asynchrone
    if (!this.isDevelopment) {
      console.log('Initialisation de Firebase Messaging...');
      this.messagingPromise = initializeMessaging();
    } else {
      console.log('Mode développement: Firebase Messaging désactivé');
      this.messagingPromise = Promise.resolve(mockMessaging);
    }
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
    // En mode développement, simuler une permission accordée
    if (this.isDevelopment) {
      console.log('Mode développement: Simulation de permission accordée');
      return true;
    }
    
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
    // En mode développement, retourner un token fictif
    if (this.isDevelopment) {
      console.log('Mode développement: Utilisation d\'un token fictif');
      return 'dev-token-' + Date.now();
    }
    
    try {
      // Attendre l'initialisation de Firebase Messaging
      const messagingService = await this.messagingPromise;
      
      console.log('Tentative de récupération du token');
      const currentToken = await messagingService.getToken({ vapidKey: this.vapidKey });
      
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

  async onMessageReceived(callback) {
    // En mode développement, ne rien faire
    if (this.isDevelopment) {
      console.log('Mode développement: Notifications désactivées');
      return () => {};
    }
    
    try {
      // Attendre l'initialisation de Firebase Messaging
      const messagingService = await this.messagingPromise;
      
      return messagingService.onMessage((payload) => {
        console.log('Message reçu:', payload);
        callback(payload);
      });
    } catch (error) {
      console.error('Erreur lors de la configuration des notifications:', error);
      return () => {};
    }
  }
}

export const notificationService = new NotificationService();
