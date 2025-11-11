# 🔧 Solución: API Key de Firebase Inválida

## ❌ Problema Detectado

La API Key `AIzaSyDM6dgLBJrqzSwdXUiDIFiSybkWVNkSJ4o` **NO es válida**.

Error: `auth/api-key-not-valid.-please-pass-a-valid-api-key.`

---

## 🔍 Posibles Causas

### 1. **API Key Incorrecta o Copiada Mal**
La API Key puede tener un carácter extra, faltante o incorrecto.

### 2. **Restricciones en la API Key**
Firebase permite restringir las API Keys por dominio/IP. Si está restringida, no funcionará en localhost.

### 3. **Authentication No Habilitado**
El servicio de Authentication no está habilitado en Firebase Console.

### 4. **Email/Password No Habilitado**
El método de autenticación Email/Password no está activado.

---

## ✅ Solución Paso a Paso

### **Paso 1: Ir a Firebase Console**

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **bancamia-dataexpress-test**

---

### **Paso 2: Verificar Authentication**

1. En el menú izquierdo, click en **"Authentication"**
2. Si dice **"Get Started"**, haz click (está deshabilitado)
3. Ve a la pestaña **"Sign-in method"**
4. Busca **"Email/Password"**
5. Si está **Disabled**, haz click y **Enable**
6. Guarda los cambios

---

### **Paso 3: Obtener la API Key Correcta**

1. Click en el ícono de **⚙️ (Settings)** arriba a la izquierda
2. Selecciona **"Project settings"**
3. En la sección **"General"**, baja hasta **"Your apps"**
4. Si no hay una app Web, haz click en **"</>** (Web)
   - Nombre: `Bancamia Frontend`
   - **NO** marcar Firebase Hosting
   - Click **"Register app"**
5. Copia las credenciales que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Copia esta
  authDomain: "....firebaseapp.com",
  projectId: "bancamia-dataexpress-test",
  storageBucket: "....firebasestorage.app",
  messagingSenderId: "...",
  appId: "1:...:web:...",
  measurementId: "G-..."
};
```

---

### **Paso 4: Verificar Restricciones de la API Key**

1. En **Project Settings**, baja hasta **"Web API Key"**
2. Click en el ícono de **lápiz** o **"View in Cloud Console"**
3. Esto te lleva a Google Cloud Console
4. En **"Application restrictions"**:
   - Debería estar en **"None"** O
   - Si está en **"HTTP referrers"**, agrega:
     - `http://localhost:3000/*`
     - `http://localhost/*`
5. En **"API restrictions"**:
   - Debería estar en **"Don't restrict key"** O
   - Si está restringida, asegúrate que incluya:
     - Identity Toolkit API
     - Token Service API
6. Guarda los cambios

---

### **Paso 5: Actualizar .env.local**

Con la nueva API Key correcta, actualiza tu archivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza_LA_NUEVA_API_KEY_CORRECTA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bancamia-dataexpress-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bancamia-dataexpress-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bancamia-dataexpress-test.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=533748472645
NEXT_PUBLIC_FIREBASE_APP_ID=1:533748472645:web:ffebad4f00b8009873fc2c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E3NKWCQT0X
```

---

### **Paso 6: Reiniciar el Servidor**

```bash
# Detener el servidor (Ctrl + C)
# Reiniciar
npm run dev
```

---

### **Paso 7: Probar de Nuevo**

```bash
node test-firebase.js
```

Deberías ver:
```
✅ Firebase inicializado correctamente
✅ Auth obtenido correctamente
✅ ¡LOGIN EXITOSO!
```

---

## 🧪 Test Rápido desde Terminal

También puedes usar curl para verificar la API Key:

```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDM6dgLBJrqzSwdXUiDIFiSybkWVNkSJ4o" -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"returnSecureToken\":true}"
```

Si la API Key es válida, responderá (aunque falle el login por usuario inexistente).
Si es inválida, dirá: `API key not valid`

---

## 📸 Capturas Recomendadas

Cuando estés en Firebase Console, verifica:

1. ✅ Authentication está habilitado
2. ✅ Email/Password está Enabled
3. ✅ Web API Key existe y no tiene restricciones
4. ✅ La API Key en "Your apps" coincide con la de .env.local

---

## 🆘 Si Nada Funciona

**Opción 1: Crear un Nuevo Proyecto de Firebase**
1. Crea un nuevo proyecto desde cero
2. Habilita Authentication > Email/Password
3. Crea una Web App
4. Usa las nuevas credenciales

**Opción 2: Crear una Nueva Web API Key**
1. Ve a Google Cloud Console
2. APIs & Services > Credentials
3. Create Credentials > API Key
4. Copia la nueva key
5. Úsala en .env.local

---

**¿Necesitas ayuda con algún paso?** Avísame qué encuentras en Firebase Console.

