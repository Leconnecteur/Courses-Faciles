import { useEffect, useState } from 'react';
import { ref, onValue, push, remove, set, get } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getStoreById } from '../data/stores';

export const useFirebase = (storeId = null) => {
  const [items, setItems] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Charger les listes de l'utilisateur
  useEffect(() => {
    console.log('Initializing Firebase connection for user lists...');
    if (!currentUser) {
      setUserLists([]);
      setLoadingLists(false);
      return () => {};
    }
    
    const listsRef = ref(db, `users/${currentUser.uid}/shopping-lists`);
    
    const unsubscribe = onValue(listsRef, (snapshot) => {
      console.log('Received lists data from Firebase:', snapshot.val());
      const data = snapshot.val();
      if (data) {
        const listData = Object.entries(data).map(([id, values]) => {
          const store = getStoreById(values.storeId);
          return {
            id,
            ...values,
            storeName: store ? store.name : 'Magasin inconnu',
            storeLogo: store ? store.logo : '',
            itemCount: values.itemCount || 0
          };
        });
        setUserLists(listData);
        console.log('Processed lists:', listData);
      } else {
        setUserLists([]);
        console.log('No lists found in database');
      }
      setLoadingLists(false);
    }, (error) => {
      console.error('Firebase lists error:', error);
      setLoadingLists(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Charger les items d'une liste spécifique si storeId est fourni
  useEffect(() => {
    console.log('Initializing Firebase connection for items...');
    if (!currentUser || !storeId) {
      setItems([]);
      setLoading(false);
      return () => {};
    }
    
    const itemsRef = ref(db, `users/${currentUser.uid}/shopping-lists/${storeId}/items`);
    
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      console.log(`Received data from Firebase for store ${storeId}:`, snapshot.val());
      const data = snapshot.val();
      if (data) {
        const itemsList = Object.entries(data).map(([id, values]) => ({
          id,
          ...values,
        }));
        setItems(itemsList);
        console.log('Processed items:', itemsList);
      } else {
        setItems([]);
        console.log('No items found in database');
      }
      setLoading(false);
    }, (error) => {
      console.error('Firebase error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, storeId]);

  const createList = async (storeId, listName = '') => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      
      console.log('Creating list for store:', storeId);
      const listsRef = ref(db, `users/${currentUser.uid}/shopping-lists`);
      const store = getStoreById(storeId);
      const name = listName || (store ? store.name : 'Nouvelle liste');
      
      const result = await push(listsRef, {
        storeId,
        name,
        createdAt: Date.now(),
        itemCount: 0
      });
      console.log('List created successfully:', result.key);
      return result.key;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  };

  const deleteList = async (listId) => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      
      console.log('Deleting list:', listId);
      const listRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}`);
      await remove(listRef);
      console.log('List deleted successfully');
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  };

  const addItem = async (item, listId) => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      if (!listId) throw new Error('ID de liste non spécifié');
      
      console.log('Adding item to list', listId, ':', item);
      const itemsRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}/items`);
      const result = await push(itemsRef, {
        ...item,
        createdAt: Date.now()
      });
      
      // Mettre à jour le compteur d'articles
      const listRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}`);
      const listSnapshot = await get(listRef);
      const listData = listSnapshot.val();
      if (listData) {
        await set(listRef, {
          ...listData,
          itemCount: (listData.itemCount || 0) + 1
        });
      }
      
      console.log('Item added successfully:', result.key);
      return result.key;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const removeItem = async (itemId, listId) => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      if (!listId) throw new Error('ID de liste non spécifié');
      
      console.log('Removing item:', itemId, 'from list:', listId);
      const itemRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}/items/${itemId}`);
      await remove(itemRef);
      
      // Mettre à jour le compteur d'articles
      const listRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}`);
      const listSnapshot = await get(listRef);
      const listData = listSnapshot.val();
      if (listData && listData.itemCount > 0) {
        await set(listRef, {
          ...listData,
          itemCount: listData.itemCount - 1
        });
      }
      
      console.log('Item removed successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId, updates, listId) => {
    if (!currentUser) throw new Error('Utilisateur non connecté');
    if (!listId) throw new Error('ID de liste non spécifié');
    
    const itemRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}/items/${itemId}`);
    await set(itemRef, updates);
  };
  
  const updateList = async (listId, updates) => {
    if (!currentUser) throw new Error('Utilisateur non connecté');
    
    const listRef = ref(db, `users/${currentUser.uid}/shopping-lists/${listId}`);
    await set(listRef, updates);
  };

  return {
    items,
    loading,
    userLists,
    loadingLists,
    addItem,
    removeItem,
    updateItem,
    createList,
    deleteList,
    updateList
  };
};
