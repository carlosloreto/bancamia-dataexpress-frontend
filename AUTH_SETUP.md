# 🔐 Configuración de Autenticación - Bancamía

Esta guía te ayudará a configurar la autenticación con Firebase en tu aplicación Next.js.

## 📋 Tabla de Contenidos

1. [Arquitectura de Autenticación](#arquitectura)
2. [Configuración de Firebase](#configuración-de-firebase)
3. [Variables de Entorno](#variables-de-entorno)
4. [Uso del Sistema](#uso-del-sistema)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🏗️ Arquitectura de Autenticación

El sistema de autenticación funciona de la siguiente manera:

```
1. Usuario ingresa email/password
   ↓
2. Firebase Auth autentica y genera idToken
   ↓
3. Frontend envía idToken a POST /api/v1/auth/login
   ↓
4. Backend valida idToken y retorna JWT
   ↓
5. Frontend guarda JWT y lo usa en peticiones protegidas
```

### Componentes Principales

- **`lib/firebase.ts`**: Configuración de Firebase
- **`lib/api-client.ts`**: Cliente HTTP con interceptores para tokens
- **`lib/auth.service.ts`**: Lógica de autenticación (login, register, logout)
- **`contexts/AuthContext.tsx`**: Estado global de autenticación
- **`components/ProtectedRoute.tsx`**: Componente para proteger rutas
- **`app/login/page.tsx`**: Página de inicio de sesión
- **`app/register/page.tsx`**: Página de registro

---

## 🔥 Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Sigue el asistente para crear tu proyecto

### 2. Habilitar Authentication

1. En el menú lateral, selecciona **Authentication**
2. Haz clic en **Comenzar**
3. Habilita el proveedor **Email/Password**:
   - Activa "Email/Password"
   - Guarda los cambios

### 3. Obtener Credenciales

1. Ve a **Project Settings** (ícono de engranaje)
2. En la sección **General**, busca "Tus aplicaciones"
3. Selecciona el ícono **Web** (`</>`)
4. Registra tu app (nombre: "Bancamia Frontend")
5. Copia las credenciales que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  // ... otros campos
};
```

---

## ⚙️ Variables de Entorno

### 1. Copiar archivo de ejemplo

```bash
cp env.example .env.local
```

### 2. Configurar variables de Firebase

Edita `.env.local` y agrega tus credenciales de Firebase:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bancamia-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bancamia-xxxxx

# API URL
NEXT_PUBLIC_API_URL=https://bancamia-dataexpress-api-848620556467.southamerica-east1.run.app
```

### 3. Reiniciar servidor de desarrollo

```bash
npm run dev
```

---

## 🚀 Uso del Sistema

### Para Usuarios

#### 1. Registro de Nuevo Usuario

1. Ve a [http://localhost:3000/register](http://localhost:3000/register)
2. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
3. Haz clic en **Crear Cuenta**
4. Serás redirigido al panel de administración automáticamente

#### 2. Iniciar Sesión

1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa tu email y contraseña
3. Haz clic en **Iniciar Sesión**
4. Serás redirigido al panel de administración

#### 3. Cerrar Sesión

- En el panel de administración, haz clic en el botón **Cerrar Sesión**

### Para Desarrolladores

#### Usar el Hook `useAuth`

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No autenticado</p>;
  }

  return (
    <div>
      <p>Bienvenido, {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

#### Proteger una Ruta

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PaginaProtegida() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Contenido Protegido</h1>
        <p>Solo usuarios autenticados pueden ver esto</p>
      </div>
    </ProtectedRoute>
  );
}
```

#### Hacer Peticiones Autenticadas

```tsx
import { api } from '@/lib/api-client';

// El token se agrega automáticamente
const response = await api.get('/api/v1/solicitudes');
```

---

## 📡 Endpoints de la API

### POST `/api/v1/auth/login`

Autentica un usuario con Firebase idToken.

**Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "abc123",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST `/api/v1/auth/register`

Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "firebaseUid": "abc123",
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "abc123",
      "email": "usuario@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### GET `/api/v1/auth/me`

Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "abc123",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "role": "user"
    }
  }
}
```

---

## 🔧 Solución de Problemas

### Error: "Firebase no está completamente configurado"

**Causa:** Las variables de entorno de Firebase no están configuradas.

**Solución:**
1. Verifica que `.env.local` existe
2. Confirma que las variables comienzan con `NEXT_PUBLIC_`
3. Reinicia el servidor de desarrollo

### Error: "auth/invalid-email" o "auth/wrong-password"

**Causa:** Credenciales incorrectas.

**Solución:**
- Verifica que el email y contraseña son correctos
- Si es un usuario nuevo, regístrate primero

### Error: "El email ya está registrado"

**Causa:** El usuario ya existe en Firebase.

**Solución:**
- Usa la página de login en lugar de registro
- O usa un email diferente

### Error: "La contraseña debe tener al menos 6 caracteres"

**Causa:** Firebase requiere contraseñas de al menos 6 caracteres.

**Solución:**
- Usa una contraseña más larga

### Error: 401 - No autorizado

**Causa:** El token expiró o es inválido.

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- El sistema debería hacer esto automáticamente

### Error: "Error de conexión con el servidor"

**Causa:** La API no está disponible o la URL es incorrecta.

**Solución:**
1. Verifica `NEXT_PUBLIC_API_URL` en `.env.local`
2. Confirma que la API está corriendo
3. Verifica tu conexión a internet

---

## 📚 Recursos Adicionales

- [Documentación de Firebase Auth](https://firebase.google.com/docs/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 🤝 Soporte

¿Necesitas ayuda? Contacta al equipo de desarrollo.

**Bancamía** - El Banco de los que creen 💙

