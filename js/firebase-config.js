/**
 * Firebase Configuration
 * Projeto: caxxx-75351
 */

const firebaseConfig = {
    apiKey: "AIzaSyA0MEqnm1nDcc4BBmd60xuRUKa02ahDk0Y",
    authDomain: "caxxx-75351.firebaseapp.com",
    projectId: "caxxx-75351",
    storageBucket: "caxxx-75351.firebasestorage.app",
    messagingSenderId: "442983610078",
    appId: "1:442983610078:web:ab504e9db2cfe0d03db44f",
    measurementId: "G-WZ2QV5Y4KH"
};

// Inicializa Firebase (sintaxe compat)
firebase.initializeApp(firebaseConfig);

// Inicializa Firestore
const db = firebase.firestore();

// Exporta para uso global
window.firebaseDB = db;

console.log('🔥 Firebase initialized successfully!');