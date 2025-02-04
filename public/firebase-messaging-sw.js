importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBUnOCSJZf-3oSkaorzGg9kIJ8khu_uoBw",
  authDomain: "courses-faciles.firebaseapp.com",
  projectId: "courses-faciles",
  storageBucket: "courses-faciles.firebasestorage.app",
  messagingSenderId: "49940189757",
  appId: "1:49940189757:web:7adae02d63f7b10d395054",
  databaseURL: "https://courses-faciles-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan:', payload);
  
  let notificationTitle = "Nouvel article ajouté";
  let notificationOptions = {
    body: 'Un nouvel article a été ajouté à la liste',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'new-item',
    vibrate: [200, 100, 200],
    data: {
      click_action: 'https://courses-faciles-v2.vercel.app' // Remplacez par votre URL Vercel
    }
  };

  if (payload.data) {
    if (payload.data.title) {
      notificationTitle = payload.data.title;
    }
    if (payload.data.body) {
      notificationOptions.body = payload.data.body;
    }
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});
