import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyCGx_mqzYyd-SlyCwNIsGBP2vTqLlF-f2g",
  authDomain: "carolove-98cbb.firebaseapp.com",
  projectId: "carolove-98cbb",
  storageBucket: "carolove-98cbb.appspot.com",
  messagingSenderId: "357221882435",
  appId: "1:357221882435:web:dfb18eb4ffb554f4d992f6",
  measurementId: "G-R4PD0YV5V2"
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Set persistence
});

const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
