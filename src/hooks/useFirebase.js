import { useEffect, useState } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useFirebase = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('Initializing Firebase connection...');
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return () => {};
    }
    
    const itemsRef = ref(db, `users/${currentUser.uid}/shopping-items`);
    
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      console.log('Received data from Firebase:', snapshot.val());
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
  }, [currentUser]);

  const addItem = async (item) => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      
      console.log('Adding item:', item);
      const itemsRef = ref(db, `users/${currentUser.uid}/shopping-items`);
      const result = await push(itemsRef, {
        ...item,
        createdAt: Date.now()
      });
      console.log('Item added successfully:', result.key);
      return result.key;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (!currentUser) throw new Error('Utilisateur non connecté');
      
      console.log('Removing item:', itemId);
      const itemRef = ref(db, `users/${currentUser.uid}/shopping-items/${itemId}`);
      await remove(itemRef);
      console.log('Item removed successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId, updates) => {
    if (!currentUser) throw new Error('Utilisateur non connecté');
    
    const itemRef = ref(db, `users/${currentUser.uid}/shopping-items/${itemId}`);
    await set(itemRef, updates);
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateItem,
  };
};
