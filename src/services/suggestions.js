import { getItemHistory } from './offlineStorage';

// Calculer la fréquence des articles
export async function getFrequentItems(limit = 5) {
  const history = await getItemHistory();
  const frequency = {};
  
  history.forEach(item => {
    frequency[item.name] = (frequency[item.name] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name]) => name);
}

// Trouver les articles souvent achetés ensemble
export async function getRelatedItems(itemName) {
  const history = await getItemHistory();
  const relatedItems = {};
  
  // Grouper les articles par date (même jour = même session d'achat)
  const sessions = history.reduce((acc, item) => {
    const date = new Date(item.completedAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item.name);
    return acc;
  }, {});
  
  // Calculer les corrélations
  Object.values(sessions).forEach(session => {
    if (session.includes(itemName)) {
      session.forEach(otherItem => {
        if (otherItem !== itemName) {
          relatedItems[otherItem] = (relatedItems[otherItem] || 0) + 1;
        }
      });
    }
  });
  
  return Object.entries(relatedItems)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name);
}

// Générer des suggestions basées sur l'historique
export async function getSuggestions(partialInput) {
  const history = await getItemHistory();
  const frequentItems = await getFrequentItems();
  
  // Filtrer les suggestions basées sur l'entrée partielle
  const matchingItems = history
    .map(item => item.name)
    .filter(name => 
      name.toLowerCase().includes(partialInput.toLowerCase()) &&
      name.toLowerCase() !== partialInput.toLowerCase()
    );
  
  // Combiner avec les articles fréquents
  const suggestions = [...new Set([...matchingItems, ...frequentItems])];
  
  return suggestions.slice(0, 5);
}

// Analyser les habitudes d'achat
export async function getShoppingAnalytics() {
  const history = await getItemHistory();
  
  // Statistiques par catégorie
  const categoryStats = history.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  
  // Statistiques par mois
  const monthlyStats = history.reduce((acc, item) => {
    const month = new Date(item.completedAt).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  
  // Articles les plus achetés
  const topItems = await getFrequentItems(10);
  
  return {
    categoryStats,
    monthlyStats,
    topItems
  };
}
