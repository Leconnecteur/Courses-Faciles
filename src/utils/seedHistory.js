import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

// Articles courants pour pré-remplir l'historique
const commonItems = [
  { name: 'Oeufs', category: 'Produits Laitiers', count: 15 },
  { name: 'Tomates', category: 'Fruits et Légumes', count: 12 },
  { name: 'Pain', category: 'Épicerie', count: 20 },
  { name: 'Lait', category: 'Produits Laitiers', count: 18 },
  { name: 'Fromage', category: 'Produits Laitiers', count: 10 },
  { name: 'Pommes', category: 'Fruits et Légumes', count: 14 },
  { name: 'Bananes', category: 'Fruits et Légumes', count: 16 },
  { name: 'Poulet', category: 'Viandes', count: 8 },
  { name: 'Pâtes', category: 'Épicerie', count: 11 },
  { name: 'Riz', category: 'Épicerie', count: 9 },
  { name: 'Eau', category: 'Boissons', count: 13 },
  { name: 'Jus d\'orange', category: 'Boissons', count: 7 },
  { name: 'Yaourt', category: 'Produits Laitiers', count: 12 },
  { name: 'Beurre', category: 'Produits Laitiers', count: 10 },
  { name: 'Carottes', category: 'Fruits et Légumes', count: 9 },
  { name: 'Courgettes', category: 'Fruits et Légumes', count: 8 },
  { name: 'Concombre', category: 'Fruits et Légumes', count: 7 },
  { name: 'Salade', category: 'Fruits et Légumes', count: 11 },
  { name: 'Poivrons', category: 'Fruits et Légumes', count: 6 },
  { name: 'Oignons', category: 'Fruits et Légumes', count: 10 },
  { name: 'Ail', category: 'Fruits et Légumes', count: 8 },
  { name: 'Pommes de terre', category: 'Fruits et Légumes', count: 12 },
  { name: 'Viande hachée', category: 'Viandes', count: 9 },
  { name: 'Saumon', category: 'Viandes', count: 5 },
  { name: 'Thon', category: 'Épicerie', count: 7 },
  { name: 'Huile d\'olive', category: 'Épicerie', count: 6 },
  { name: 'Sel', category: 'Épicerie', count: 4 },
  { name: 'Poivre', category: 'Épicerie', count: 4 },
  { name: 'Sucre', category: 'Épicerie', count: 5 },
  { name: 'Farine', category: 'Épicerie', count: 6 },
  { name: 'Chocolat', category: 'Épicerie', count: 8 },
  { name: 'Café', category: 'Boissons', count: 10 },
  { name: 'Thé', category: 'Boissons', count: 7 },
  { name: 'Céréales', category: 'Épicerie', count: 9 },
  { name: 'Confiture', category: 'Épicerie', count: 6 },
  { name: 'Miel', category: 'Épicerie', count: 5 },
  { name: 'Dentifrice', category: 'Hygiène', count: 8 },
  { name: 'Savon', category: 'Hygiène', count: 9 },
  { name: 'Shampoing', category: 'Hygiène', count: 7 },
  { name: 'Papier toilette', category: 'Hygiène', count: 10 },
];

/**
 * Pré-remplit l'historique de l'utilisateur avec des articles courants
 * Utile pour tester l'autocomplétion sans avoir à ajouter manuellement des articles
 */
export const seedUserHistory = async (userId) => {
  if (!userId) {
    console.error('User ID requis pour initialiser l\'historique');
    return;
  }

  try {
    console.log('Initialisation de l\'historique avec des articles courants...');
    
    for (const item of commonItems) {
      const historyRef = ref(db, `users/${userId}/item-history/${item.name}`);
      await set(historyRef, {
        count: item.count,
        lastUsed: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Dates aléatoires dans les 30 derniers jours
        category: item.category
      });
    }
    
    console.log(`✅ Historique initialisé avec ${commonItems.length} articles`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'historique:', error);
    return false;
  }
};

/**
 * Vérifie si l'historique de l'utilisateur est vide
 */
export const isHistoryEmpty = async (userId) => {
  if (!userId) return true;
  
  try {
    const historyRef = ref(db, `users/${userId}/item-history`);
    const { get } = await import('firebase/database');
    const snapshot = await get(historyRef);
    return !snapshot.exists();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'historique:', error);
    return true;
  }
};
