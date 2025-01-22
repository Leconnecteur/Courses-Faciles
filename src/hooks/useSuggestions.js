import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../config/firebase';

export function useSuggestions() {
  const [recentItems, setRecentItems] = useState([]);
  const [frequentPairs, setFrequentPairs] = useState({});

  // Charger l'historique des articles
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyRef = ref(db, 'shopping-history');
        const snapshot = await get(historyRef);
        const history = snapshot.val() || [];

        // Extraire les articles récents uniques
        const recent = [...new Set(history
          .sort((a, b) => b.completedAt - a.completedAt)
          .map(item => item.name)
        )].slice(0, 10);

        // Calculer les paires fréquentes
        const pairs = {};
        for (let i = 0; i < history.length; i++) {
          const item = history[i];
          const sameDay = history.filter(h => 
            new Date(h.completedAt).toDateString() === new Date(item.completedAt).toDateString()
          );
          
          sameDay.forEach(other => {
            if (other.name !== item.name) {
              if (!pairs[item.name]) pairs[item.name] = {};
              pairs[item.name][other.name] = (pairs[item.name][other.name] || 0) + 1;
            }
          });
        }

        setRecentItems(recent);
        setFrequentPairs(pairs);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
      }
    };

    loadHistory();
  }, []);

  // Obtenir des suggestions basées sur le texte saisi
  const getSuggestions = (text) => {
    if (!text) return [];
    
    const normalizedText = text.toLowerCase();
    return recentItems.filter(item => 
      item.toLowerCase().includes(normalizedText)
    );
  };

  // Obtenir les articles fréquemment achetés avec un article donné
  const getRelatedItems = (itemName) => {
    if (!itemName || !frequentPairs[itemName]) return [];
    
    return Object.entries(frequentPairs[itemName])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);
  };

  return {
    getSuggestions,
    getRelatedItems
  };
}
