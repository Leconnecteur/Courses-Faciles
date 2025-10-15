import { useState, useEffect } from 'react';
import { ref, get, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useSuggestions() {
  const [recentItems, setRecentItems] = useState([]);
  const [frequentPairs, setFrequentPairs] = useState({});
  const { currentUser } = useAuth();

  // Charger l'historique des articles de l'utilisateur
  useEffect(() => {
    if (!currentUser) {
      setRecentItems([]);
      setFrequentPairs({});
      return;
    }

    const historyRef = ref(db, `users/${currentUser.uid}/item-history`);
    
    const unsubscribe = onValue(historyRef, (snapshot) => {
      try {
        const data = snapshot.val();
        
        if (data) {
          // Convertir l'objet en tableau et trier par fréquence et date
          const historyArray = Object.entries(data).map(([name, info]) => ({
            name,
            count: info.count || 1,
            lastUsed: info.lastUsed || 0,
            category: info.category || 'Autre'
          }));

          // Trier par fréquence d'utilisation puis par date
          historyArray.sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count; // Plus utilisé en premier
            }
            return b.lastUsed - a.lastUsed; // Plus récent en premier
          });

          // Extraire les noms uniques
          const recent = historyArray.map(item => item.name);
          
          setRecentItems(recent);
          console.log('Historique chargé:', recent.length, 'articles');
        } else {
          setRecentItems([]);
          console.log('Aucun historique trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Obtenir des suggestions basées sur le texte saisi
  const getSuggestions = (text) => {
    if (!text || text.length < 2) return [];
    
    const normalizedText = text.toLowerCase().trim();
    
    // Filtrer les articles qui commencent par le texte saisi (priorité)
    const startsWith = recentItems.filter(item => 
      item.toLowerCase().startsWith(normalizedText)
    );
    
    // Filtrer les articles qui contiennent le texte saisi
    const contains = recentItems.filter(item => 
      item.toLowerCase().includes(normalizedText) && 
      !item.toLowerCase().startsWith(normalizedText)
    );
    
    // Combiner les résultats (commence par en premier, puis contient)
    const results = [...startsWith, ...contains].slice(0, 5);
    
    return results;
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
    getRelatedItems,
    recentItems
  };
}
