import localforage from 'localforage';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebase';

// Configuration de localforage
localforage.config({
  name: 'courses-faciles',
  storeName: 'shopping_items'
});

// File d'attente pour les opérations en attente
const pendingOperations = [];

// Vérification de la connexion
export function isOnline() {
  return navigator.onLine;
}

// Écouter les changements de connexion
export function setupConnectivityListeners(onOnline, onOffline) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Sauvegarder localement
export async function saveLocally(key, data) {
  try {
    await localforage.setItem(key, data);
    if (!isOnline()) {
      pendingOperations.push({ key, data });
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde locale:', error);
  }
}

// Récupérer les données locales
export async function getLocalData(key) {
  try {
    return await localforage.getItem(key);
  } catch (error) {
    console.error('Erreur lors de la récupération locale:', error);
    return null;
  }
}

// Synchroniser avec Firebase
export async function syncWithFirebase() {
  if (!isOnline() || pendingOperations.length === 0) return;

  try {
    for (const operation of pendingOperations) {
      const { key, data } = operation;
      await set(ref(db, key), data);
    }
    pendingOperations.length = 0; // Vider la file d'attente
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}

// Récupérer l'historique des articles
export async function getItemHistory() {
  try {
    const historyRef = ref(db, 'shopping-history');
    const snapshot = await get(historyRef);
    return snapshot.val() || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
}

// Sauvegarder dans l'historique
export async function saveToHistory(item) {
  try {
    const history = await getItemHistory();
    history.push({
      ...item,
      completedAt: Date.now()
    });
    
    if (isOnline()) {
      await set(ref(db, 'shopping-history'), history);
    } else {
      await saveLocally('shopping-history', history);
      pendingOperations.push({ 
        key: 'shopping-history', 
        data: history 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans l\'historique:', error);
  }
}
