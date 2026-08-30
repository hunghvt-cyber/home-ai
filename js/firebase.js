import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVGwWuRpdoFJCGhYDG5drIKFqVJp0O3Ro",
  authDomain: "home-ai-55a88.firebaseapp.com",
  projectId: "home-ai-55a88",
  storageBucket: "home-ai-55a88.firebasestorage.app",
  messagingSenderId: "187947750301",
  appId: "1:187947750301:web:3c5b16b16352e0ab71d574"
};

const firebaseApp =
    initializeApp(firebaseConfig);

const firestore =
    getFirestore(firebaseApp);

export {
    firebaseApp,
    firestore
};
