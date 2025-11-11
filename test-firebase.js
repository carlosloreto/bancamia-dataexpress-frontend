// Test de Firebase - Verificar si la API Key es válida
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDM6dgLBJrqzSwdXUiDIFiSybkWVNkSJ4o",
  authDomain: "bancamia-dataexpress-test.firebaseapp.com",
  projectId: "bancamia-dataexpress-test",
};

console.log('🔥 Iniciando prueba de Firebase...\n');
console.log('Configuración:');
console.log('  API Key:', firebaseConfig.apiKey);
console.log('  Auth Domain:', firebaseConfig.authDomain);
console.log('  Project ID:', firebaseConfig.projectId);
console.log('\n---\n');

try {
  // Inicializar Firebase
  console.log('📦 Inicializando Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado correctamente\n');
  
  // Obtener Auth
  console.log('🔐 Obteniendo instancia de Auth...');
  const auth = getAuth(app);
  console.log('✅ Auth obtenido correctamente\n');
  
  // Intentar login con las credenciales de prueba
  console.log('🧪 Intentando login con credenciales de prueba...');
  console.log('  Email: carlosloreto@gmail.com');
  console.log('  Password: Cc123456\n');
  
  signInWithEmailAndPassword(auth, 'carlosloreto@gmail.com', 'Cc123456')
    .then((userCredential) => {
      console.log('✅ ¡LOGIN EXITOSO!\n');
      console.log('Usuario autenticado:');
      console.log('  UID:', userCredential.user.uid);
      console.log('  Email:', userCredential.user.email);
      console.log('  Email verificado:', userCredential.user.emailVerified);
      
      // Obtener token
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      console.log('\n🎫 Token obtenido:');
      console.log('  ' + token.substring(0, 50) + '...');
      console.log('\n✅ ¡TODAS LAS PRUEBAS PASARON!\n');
      console.log('🎉 La API Key es VÁLIDA y el usuario existe.\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en login:');
      console.error('  Código:', error.code);
      console.error('  Mensaje:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        console.log('\n💡 El usuario no existe. Necesitas registrarlo primero.');
        console.log('   Ve a: http://localhost:3000/register\n');
      } else if (error.code === 'auth/wrong-password') {
        console.log('\n💡 La contraseña es incorrecta.\n');
      } else if (error.code === 'auth/invalid-api-key') {
        console.log('\n💡 La API Key NO es válida.\n');
      } else {
        console.log('\n💡 Otro error:', error.code, '\n');
      }
      
      process.exit(1);
    });
    
} catch (error) {
  console.error('❌ Error al inicializar Firebase:');
  console.error(error);
  
  if (error.message && error.message.includes('API key')) {
    console.log('\n❌ LA API KEY NO ES VÁLIDA\n');
  }
  
  process.exit(1);
}

