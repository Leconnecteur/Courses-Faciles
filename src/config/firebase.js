import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Déterminer si nous sommes en environnement de développement
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168');

const firebaseConfig = {
  apiKey: "AIzaSyBUnOCSJZf-3oSkaorzGg9kIJ8khu_uoBw",
  authDomain: "courses-faciles.firebaseapp.com",
  projectId: "courses-faciles",
  storageBucket: "courses-faciles.firebasestorage.app",
  messagingSenderId: "49940189757",
  appId: "1:49940189757:web:7adae02d63f7b10d395054",
  measurementId: "G-Y0L02580H8",
  databaseURL: "https://courses-faciles-default-rtdb.europe-west1.firebasedatabase.app"
};

// Mock pour Firebase Messaging et vapidKey
export const mockMessaging = {
  getToken: () => Promise.resolve('mock-token-' + Date.now()),
  onMessage: () => () => {}
};

// Fonction pour initialiser Firebase Messaging de manière asynchrone
export const initializeMessaging = () => {
  // En développement, on utilise toujours le mock
  if (isDevelopment) {
    return Promise.resolve(mockMessaging);
  }
  
  // En production, on charge le module de manière dynamique
  return import('firebase/messaging')
    .then(firebaseMessaging => {
      const { getMessaging, getToken, onMessage } = firebaseMessaging;
      const messagingInstance = getMessaging(app);
      return {
        getToken: (options) => getToken(messagingInstance, options),
        onMessage: (callback) => onMessage(messagingInstance, callback)
      };
    })
    .catch(error => {
      console.error('Erreur lors du chargement de Firebase Messaging:', error);
      return mockMessaging; // Fallback en cas d'erreur
    });
};

export const vapidKey = 'BNfRsbR2MZYSJbRcF7C2GdEAwwzWfFUtieAukXpO7kKPOz3ftgFmprjbXnlBwudVyD3FqZtWHhsbU2yZppxN1Z4';

const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase essentiels uniquement
export const db = getDatabase(app);
export const auth = getAuth(app);

// Exporter le mock pour une utilisation immédiate
export const messaging = mockMessaging;
