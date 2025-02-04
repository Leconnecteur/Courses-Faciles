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

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = "Nouvel article ajouté";
  const notificationOptions = {
    body: `${payload.data.itemName} a été ajouté à la liste`,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
