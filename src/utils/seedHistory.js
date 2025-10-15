import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

// Articles courants pour pré-remplir l'historique
const commonItems = [
  // Produits Laitiers & Œufs
  { name: 'Oeufs', category: 'Produits Laitiers & Œufs', count: 15 },
  { name: 'Lait', category: 'Produits Laitiers & Œufs', count: 18 },
  { name: 'Fromage', category: 'Produits Laitiers & Œufs', count: 10 },
  { name: 'Yaourt', category: 'Produits Laitiers & Œufs', count: 12 },
  { name: 'Beurre', category: 'Produits Laitiers & Œufs', count: 10 },
  
  // Fruits
  { name: 'Pommes', category: 'Fruits', count: 14 },
  { name: 'Bananes', category: 'Fruits', count: 16 },
  { name: 'Oranges', category: 'Fruits', count: 10 },
  { name: 'Fraises', category: 'Fruits', count: 8 },
  { name: 'Kiwis', category: 'Fruits', count: 7 },
  
  // Légumes
  { name: 'Tomates', category: 'Légumes', count: 12 },
  { name: 'Carottes', category: 'Légumes', count: 9 },
  { name: 'Courgettes', category: 'Légumes', count: 8 },
  { name: 'Concombre', category: 'Légumes', count: 7 },
  { name: 'Salade', category: 'Légumes', count: 11 },
  { name: 'Poivrons', category: 'Légumes', count: 6 },
  { name: 'Oignons', category: 'Légumes', count: 10 },
  { name: 'Ail', category: 'Légumes', count: 8 },
  { name: 'Pommes de terre', category: 'Légumes', count: 12 },
  
  // Viandes & Volailles
  { name: 'Poulet', category: 'Viandes & Volailles', count: 8 },
  { name: 'Viande hachée', category: 'Viandes & Volailles', count: 9 },
  { name: 'Steak', category: 'Viandes & Volailles', count: 6 },
  
  // Charcuterie
  { name: 'Jambon', category: 'Charcuterie', count: 11 },
  { name: 'Saucisses', category: 'Charcuterie', count: 7 },
  
  // Poissons & Fruits de mer
  { name: 'Saumon', category: 'Poissons & Fruits de mer', count: 5 },
  { name: 'Thon', category: 'Poissons & Fruits de mer', count: 7 },
  { name: 'Crevettes', category: 'Poissons & Fruits de mer', count: 4 },
  
  // Boulangerie & Pâtisserie
  { name: 'Pain', category: 'Boulangerie & Pâtisserie', count: 20 },
  { name: 'Baguette', category: 'Boulangerie & Pâtisserie', count: 18 },
  { name: 'Croissants', category: 'Boulangerie & Pâtisserie', count: 8 },
  
  // Épicerie Salée
  { name: 'Pâtes', category: 'Épicerie Salée', count: 11 },
  { name: 'Riz', category: 'Épicerie Salée', count: 9 },
  { name: 'Huile d\'olive', category: 'Épicerie Salée', count: 6 },
  { name: 'Sel', category: 'Épicerie Salée', count: 4 },
  { name: 'Poivre', category: 'Épicerie Salée', count: 4 },
  
  // Épicerie Sucrée
  { name: 'Sucre', category: 'Épicerie Sucrée', count: 5 },
  { name: 'Farine', category: 'Épicerie Sucrée', count: 6 },
  { name: 'Chocolat', category: 'Épicerie Sucrée', count: 8 },
  { name: 'Céréales', category: 'Épicerie Sucrée', count: 9 },
  { name: 'Confiture', category: 'Épicerie Sucrée', count: 6 },
  { name: 'Miel', category: 'Épicerie Sucrée', count: 5 },
  { name: 'Nutella', category: 'Épicerie Sucrée', count: 7 },
  
  // Boissons
  { name: 'Eau', category: 'Boissons', count: 13 },
  { name: 'Jus d\'orange', category: 'Boissons', count: 7 },
  { name: 'Café', category: 'Boissons', count: 10 },
  { name: 'Thé', category: 'Boissons', count: 7 },
  { name: 'Coca', category: 'Boissons', count: 6 },
  
  // Surgelés
  { name: 'Pizza', category: 'Surgelés', count: 8 },
  { name: 'Frites', category: 'Surgelés', count: 9 },
  { name: 'Glace', category: 'Surgelés', count: 10 },
  
  // Hygiène & Beauté
  { name: 'Dentifrice', category: 'Hygiène & Beauté', count: 8 },
  { name: 'Savon', category: 'Hygiène & Beauté', count: 9 },
  { name: 'Shampoing', category: 'Hygiène & Beauté', count: 7 },
  { name: 'Gel douche', category: 'Hygiène & Beauté', count: 8 },
  
  // Entretien & Maison
  { name: 'Papier toilette', category: 'Entretien & Maison', count: 10 },
  { name: 'Lessive', category: 'Entretien & Maison', count: 7 },
  { name: 'Liquide vaisselle', category: 'Entretien & Maison', count: 6 },
  { name: 'Éponges', category: 'Entretien & Maison', count: 5 },
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
