import { useState, useEffect } from 'react';
import { ref, get, set, push } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAveragePrice } from '../data/averagePrices';

/**
 * Hook pour gérer l'historique des prix des articles
 * Permet de suggérer des prix basés sur l'historique et de suivre l'évolution
 */
export function usePriceHistory() {
  const [priceHistory, setPriceHistory] = useState({});
  const { currentUser } = useAuth();

  // Charger l'historique des prix
  useEffect(() => {
    if (!currentUser) {
      setPriceHistory({});
      return;
    }

    const loadPriceHistory = async () => {
      try {
        const historyRef = ref(db, `users/${currentUser.uid}/price-history`);
        const snapshot = await get(historyRef);
        
        if (snapshot.exists()) {
          setPriceHistory(snapshot.val());
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique des prix:', error);
      }
    };

    loadPriceHistory();
  }, [currentUser]);

  /**
   * Sauvegarder un prix dans l'historique
   */
  const savePriceToHistory = async (itemName, price, category) => {
    if (!currentUser || !price || price <= 0) return;

    try {
      const normalizedName = itemName.toLowerCase().trim();
      const priceHistoryRef = ref(db, `users/${currentUser.uid}/price-history/${normalizedName}`);
      
      // Récupérer l'historique existant
      const snapshot = await get(priceHistoryRef);
      const existingHistory = snapshot.val() || { prices: [], category };

      // Ajouter le nouveau prix avec timestamp
      const newPriceEntry = {
        price: parseFloat(price),
        date: Date.now()
      };

      // Garder les 10 derniers prix
      const updatedPrices = [...(existingHistory.prices || []), newPriceEntry].slice(-10);

      // Calculer les statistiques
      const prices = updatedPrices.map(p => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const lastPrice = prices[prices.length - 1];

      await set(priceHistoryRef, {
        category,
        prices: updatedPrices,
        stats: {
          average: parseFloat(avgPrice.toFixed(2)),
          min: minPrice,
          max: maxPrice,
          last: lastPrice,
          count: updatedPrices.length
        },
        lastUpdated: Date.now()
      });

      console.log(`Prix sauvegardé pour "${itemName}": ${price}€`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du prix:', error);
    }
  };

  /**
   * Obtenir le prix suggéré pour un article
   */
  const getSuggestedPrice = (itemName) => {
    if (!itemName) return null;

    const normalizedName = itemName.toLowerCase().trim();
    const history = priceHistory[normalizedName];

    // Si on a un historique, l'utiliser en priorité
    if (history && history.stats) {
      return {
        suggested: history.stats.last || history.stats.average,
        average: history.stats.average,
        min: history.stats.min,
        max: history.stats.max,
        trend: calculateTrend(history.prices),
        source: 'history'
      };
    }

    // Sinon, utiliser la base de données des prix moyens
    const averagePrice = getAveragePrice(itemName);
    if (averagePrice) {
      return {
        suggested: averagePrice,
        average: averagePrice,
        min: averagePrice * 0.9, // -10%
        max: averagePrice * 1.1, // +10%
        trend: 'stable',
        source: 'database'
      };
    }

    return null;
  };

  /**
   * Calculer la tendance des prix (hausse, baisse, stable)
   */
  const calculateTrend = (prices) => {
    if (!prices || prices.length < 2) return 'stable';

    const recent = prices.slice(-3).map(p => p.price);
    const older = prices.slice(-6, -3).map(p => p.price);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const diff = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  };

  /**
   * Obtenir l'historique complet d'un article
   */
  const getItemPriceHistory = (itemName) => {
    if (!itemName) return null;

    const normalizedName = itemName.toLowerCase().trim();
    return priceHistory[normalizedName] || null;
  };

  return {
    savePriceToHistory,
    getSuggestedPrice,
    getItemPriceHistory,
    priceHistory
  };
}
