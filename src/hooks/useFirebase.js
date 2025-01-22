import { useEffect, useState } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { db } from '../config/firebase';

export const useFirebase = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing Firebase connection...');
    const itemsRef = ref(db, 'shopping-items');
    
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
  }, []);

  const addItem = async (item) => {
    try {
      console.log('Adding item:', item);
      const itemsRef = ref(db, 'shopping-items');
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
      console.log('Removing item:', itemId);
      const itemRef = ref(db, `shopping-items/${itemId}`);
      await remove(itemRef);
      console.log('Item removed successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId, updates) => {
    const itemRef = ref(db, `shopping-items/${itemId}`);
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
