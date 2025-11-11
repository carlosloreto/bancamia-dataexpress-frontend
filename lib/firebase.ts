// Configuración de Firebase para autenticación
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Validar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.warn('⚠️ Firebase no está completamente configurado. Verifica las variables de entorno.');
  console.warn('Requeridas: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID');
}

// Inicializar Firebase (solo si no está inicializado)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado correctamente');
} else {
  app = getApps()[0];
  console.log('ℹ️ Firebase ya estaba inicializado');
}

// Obtener instancia de Auth
export const auth: Auth = getAuth(app);
export default app;

