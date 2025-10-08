import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXpFHRmJ1cyZ8YYIhZrZjGtiE3ue9XKkw",
  authDomain: "klp-app-f14f4.firebaseapp.com",
  projectId: "klp-app-f14f4",
  storageBucket: "klp-app-f14f4.firebasestorage.app",
  messagingSenderId: "447545317677",
  appId: "1:447545317677:web:cafa95d105f43deb48dba4",
  measurementId: "G-4FTLQ8CT4J",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
