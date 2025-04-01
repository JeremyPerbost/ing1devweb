import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyAp1F_IzqR5MzjbumZixzlXjukkUC9tp4E",
  authDomain: "domovis-c272a.firebaseapp.com",
  projectId: "domovis-c272a",
  storageBucket: "domovis-c272a.firebasestorage.app",
  messagingSenderId: "843399505165",
  appId: "1:843399505165:web:0b79b56080edd71e3bbc44",
  measurementId: "G-N06L013WLW"
};

// ✅ Utilisation de `provideFirebaseApp` et `provideFirestore` dans appConfig
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),  // 🔥 Initialisation Firebase
    provideFirestore(() => getFirestore())  // 🔥 Initialisation Firestore
  ]
};
