import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBUnOCSJZf-3oSkaorzGg9kIJ8khu_uoBw",
  authDomain: "courses-faciles.firebaseapp.com",
  projectId: "courses-faciles",
  storageBucket: "courses-faciles.firebasestorage.app",
  messagingSenderId: "49940189757",
  appId: "1:49940189757:web:7adae02d63f7b10d395054",
  measurementId: "G-Y0L02580H8",
  databaseURL: "https://courses-faciles-default-rtdb.europe-west1.firebasedatabase.app"
};

export const vapidKey = 'BNfRsbR2MZYSJbRcF7C2GdEAwwzWfFUtieAukXpO7kKPOz3ftgFmprjbXnlBwudVyD3FqZtWHhsbU2yZppxN1Z4';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const messaging = getMessaging(app);
