// Configuración de Firebase para autenticación
import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Configuración de Firebase desde variables de entorno
// Next.js carga automáticamente .env, .env.local, .env.development, etc.
// Las variables NEXT_PUBLIC_* están disponibles tanto en servidor como en cliente

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validar que las variables de entorno esenciales estén configuradas
const requiredFields = [
  'apiKey',
  'authDomain',
  'projectId',
] as const;

const missingFields = requiredFields.filter(
  (field) => !firebaseConfig[field]
);

// Verificar si Firebase está completamente configurado
const isFirebaseConfigured = missingFields.length === 0;

// Detectar si estamos en tiempo de build
// Durante el build de Next.js, las variables de entorno de Cloud Run pueden no estar disponibles
// Verificamos si estamos en el proceso de build de varias formas
const isBuildTime = 
  typeof window === 'undefined' && 
  (process.env.NEXT_PHASE === 'phase-production-build' || 
   process.env.NEXT_PHASE === 'phase-development-build' ||
   process.argv.includes('build') ||
   process.env.npm_lifecycle_event === 'build');

if (!isFirebaseConfigured) {
  // Mapeo directo de campos a nombres de variables de entorno
  const fieldToEnvVar: Record<string, string> = {
    apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  };
  
  const missingEnvVars = missingFields.map(field => fieldToEnvVar[field] || `NEXT_PUBLIC_FIREBASE_${field.toUpperCase()}`);
  
  // Durante el build, solo mostrar warning y permitir continuar
  // Las variables estarán disponibles en runtime en Cloud Run
  if (isBuildTime) {
    console.warn('⚠️ ADVERTENCIA: Firebase no está completamente configurado durante el build.');
    console.warn('Esto es normal en Cloud Run si las variables de entorno se configuran en tiempo de ejecución.');
    console.warn('Variables que deben estar configuradas:', missingEnvVars.join(', '));
    console.warn('La aplicación continuará el build. Las variables se validarán en tiempo de ejecución.');
  } else {
    // En runtime, mostrar error pero solo lanzar excepción en producción si realmente se necesita
    console.error('❌ ERROR: Firebase no está completamente configurado.');
    console.error('Campos faltantes:', missingFields.join(', '));
    console.error('Variables de entorno faltantes:', missingEnvVars.join(', '));
    console.error('Por favor, configura estas variables en tu archivo .env');
    
    // Solo lanzar error en runtime de producción cuando realmente se necesite usar Firebase
    // En Cloud Run, las variables deberían estar disponibles en runtime
    if (process.env.NODE_ENV === 'production' && !isBuildTime) {
      // No lanzar error aquí, permitir que se inicialice con valores temporales
      // El error se lanzará cuando se intente usar Firebase si realmente no está configurado
      console.error('⚠️ Firebase no está configurado en runtime. Algunas funcionalidades pueden no funcionar.');
    }
  }
}

// Inicializar Firebase solo si está completamente configurado
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (isFirebaseConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado correctamente');
    console.log('📋 Proyecto:', firebaseConfig.projectId);
  } else {
    app = getApps()[0];
    console.log('ℹ️ Firebase ya estaba inicializado');
  }
  
  // Obtener instancia de Auth solo si Firebase está configurado
  authInstance = getAuth(app);
} else {
  console.warn('⚠️ Firebase no se inicializará hasta que configures las variables de entorno');
  // Crear una instancia temporal para evitar errores de tipo
  // En desarrollo, esto permitirá que la app compile pero las funciones de auth fallarán
  try {
    // Intentar crear una app temporal con valores mínimos para evitar errores de tipo
    const tempConfig: FirebaseOptions = {
      apiKey: 'temp',
      authDomain: 'temp',
      projectId: 'temp',
    };
    const tempApp = initializeApp(tempConfig, 'temp-firebase');
    authInstance = getAuth(tempApp);
    console.warn('⚠️ Usando instancia temporal de Firebase. Configura las variables de entorno para usar Firebase correctamente.');
  } catch {
    // Si falla, usar getAuth de una app existente o crear una instancia mínima
    console.error('No se pudo crear instancia temporal de Firebase');
  }
}

// Exportar auth - en desarrollo puede ser una instancia temporal si Firebase no está configurado
export const auth: Auth = authInstance!;
export default app;

