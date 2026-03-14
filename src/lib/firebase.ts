import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB0jjymv2_y9ZHPNRjVNNJjPaQiY1qYhdc",
    authDomain: "charity-website-f2daf.firebaseapp.com",
    projectId: "charity-website-f2daf",
    storageBucket: "charity-website-f2daf.firebasestorage.app",
    messagingSenderId: "871312035963",
    appId: "1:871312035963:web:16f1d96b47524b9db0d2de"
};

// ປ້ອງກັນການ initialize ຊ້ຳຊ້ອນ (ສຳຄັນຫຼາຍສຳລັບ Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // ເພີ່ມໂຕນີ້ເພື່ອໃຊ້ໃນການອັບໂຫຼດຮູບພາບ