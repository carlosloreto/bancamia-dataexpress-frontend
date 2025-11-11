# 🔐 Sistema de Autenticación Implementado

## ✅ Resumen de Implementación

Se ha implementado exitosamente un sistema completo de autenticación en tu aplicación Next.js que se integra con Firebase Auth y tu API backend.

---

## 📦 Archivos Creados

### 1. **Configuración y Servicios**

#### `lib/firebase.ts`
- Configuración de Firebase
- Inicialización del SDK de Firebase Auth
- Validación de variables de entorno

#### `lib/api-client.ts`
- Cliente HTTP basado en axios
- Interceptores automáticos para agregar tokens
- Manejo de errores 401 (redirección automática a login)
- Tipos TypeScript para respuestas de API

#### `lib/auth.service.ts`
- `login()`: Autentica con Firebase y backend
- `register()`: Registra nuevo usuario
- `logout()`: Cierra sesión
- `getProfile()`: Obtiene perfil del usuario
- Manejo completo de errores

### 2. **Contexto y Estado Global**

#### `contexts/AuthContext.tsx`
- Provider de autenticación global
- Hook `useAuth()` para acceder al estado
- Sincronización con Firebase Auth
- Estados: `user`, `loading`, `error`
- Funciones: `login()`, `register()`, `logout()`

### 3. **Componentes**

#### `components/ProtectedRoute.tsx`
- Protege rutas que requieren autenticación
- Redirige a `/login` si no está autenticado
- Muestra loading mientras verifica

### 4. **Páginas**

#### `app/login/page.tsx`
- Formulario de inicio de sesión
- Validación de campos
- Manejo de errores
- Redirección automática si ya está autenticado

#### `app/register/page.tsx`
- Formulario de registro
- Validación de email y contraseña
- Confirmación de contraseña
- Login automático después del registro

### 5. **Actualizaciones**

#### `app/layout.tsx`
- Envuelve la app con `AuthProvider`

#### `app/admin/page.tsx`
- Actualizado para usar `useAuth()` y `ProtectedRoute`
- Muestra información del usuario autenticado
- Botón de logout funcional

#### `env.example`
- Agregadas variables de Firebase:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

---

## 🚀 Cómo Usar

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar .env.local y agregar tus credenciales de Firebase
```

### 2. Obtener Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto o usa uno existente
3. Habilita **Authentication > Email/Password**
4. Ve a **Project Settings > General**
5. Copia las credenciales de configuración web

### 3. Configurar `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id

NEXT_PUBLIC_API_URL=https://bancamia-dataexpress-api-848620556467.southamerica-east1.run.app
```

### 4. Instalar Dependencias (si no lo has hecho)

```bash
npm install
```

### 5. Iniciar Servidor

```bash
npm run dev
```

---

## 🎯 Flujo de Autenticación

```
┌─────────────────┐
│ Usuario accede  │
│   a /admin      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ ProtectedRoute  │
│  verifica auth  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 NO │         │ SÍ
    │         │
    ↓         ↓
┌─────────┐  ┌─────────┐
│Redirige │  │ Muestra │
│ a login │  │contenido│
└─────────┘  └─────────┘
```

### Login Flow

```
1. Usuario ingresa email/password
   ↓
2. Frontend → Firebase Auth (signInWithEmailAndPassword)
   ↓
3. Firebase retorna idToken
   ↓
4. Frontend → POST /api/v1/auth/login { idToken }
   ↓
5. Backend valida idToken y retorna JWT
   ↓
6. Frontend guarda token en localStorage
   ↓
7. Axios interceptor agrega token automáticamente
```

---

## 🔧 API de Autenticación

### Hook `useAuth()`

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const {
    user,         // Usuario autenticado (null si no está autenticado)
    loading,      // true mientras verifica autenticación
    error,        // Mensaje de error (si hay)
    login,        // (email, password) => Promise<void>
    register,     // ({ email, password, name }) => Promise<void>
    logout,       // () => Promise<void>
    clearError    // () => void
  } = useAuth();

  // Tu lógica aquí
}
```

### Ejemplo: Mostrar Usuario

```tsx
function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <p>Bienvenido, {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### Ejemplo: Proteger Ruta

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Panel de Control</h1>
      {/* Solo usuarios autenticados verán esto */}
    </ProtectedRoute>
  );
}
```

### Ejemplo: Petición Autenticada

```tsx
import { api } from '@/lib/api-client';

async function obtenerDatos() {
  try {
    // El token se agrega automáticamente
    const response = await api.get('/api/v1/solicitudes');
    
    if (response.success) {
      console.log(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🛣️ Rutas Disponibles

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Formulario público | ❌ No |
| `/login` | Inicio de sesión | ❌ No |
| `/register` | Registro de usuarios | ❌ No |
| `/admin` | Panel de administración | ✅ Sí |

---

## 🔐 Endpoints del Backend

### POST `/api/v1/auth/login`

Autentica con Firebase idToken.

**Request:**
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
      "email": "user@example.com",
      "name": "Juan Pérez",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST `/api/v1/auth/register`

Registra nuevo usuario.

**Request:**
```json
{
  "email": "user@example.com",
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
      "email": "user@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### GET `/api/v1/auth/me`

Obtiene perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "abc123",
      "email": "user@example.com",
      "name": "Juan Pérez",
      "role": "user"
    }
  }
}
```

---

## 🎨 Características Implementadas

✅ **Autenticación con Firebase**
- Login con email/password
- Registro de nuevos usuarios
- Cierre de sesión

✅ **Integración con Backend**
- Envío de idToken a la API
- Recepción y almacenamiento de JWT
- Renovación automática de tokens

✅ **Estado Global**
- Context API para manejo de autenticación
- Hook personalizado `useAuth()`
- Sincronización con Firebase Auth

✅ **Protección de Rutas**
- Componente `ProtectedRoute`
- Redirección automática
- Estados de loading

✅ **Interceptores HTTP**
- Adición automática de tokens
- Manejo de errores 401
- Redirección al expirar sesión

✅ **UI/UX**
- Formularios con validación
- Mensajes de error claros
- Estados de carga
- Diseño responsive con Tailwind CSS

✅ **Seguridad**
- Tokens almacenados en localStorage
- HTTPS en producción
- Validación de formularios
- Manejo seguro de credenciales

---

## 🐛 Solución de Problemas

### Error: "Firebase no está completamente configurado"

**Solución:**
```bash
# Verificar que las variables estén en .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Reiniciar servidor
npm run dev
```

### Error: "auth/wrong-password"

**Solución:** Verifica que la contraseña sea correcta

### Error: "El email ya está registrado"

**Solución:** El usuario ya existe, usa la página de login

### Error: 401 después de recargar

**Solución:** El token expiró, cierra sesión y vuelve a iniciar

---

## 📚 Documentación Adicional

- Ver `AUTH_SETUP.md` para guía detallada de configuración
- Ver `README.md` para información general del proyecto

---

## ✨ Próximos Pasos Sugeridos

1. **Configurar Firebase en tu proyecto**
2. **Agregar variables de entorno**
3. **Probar el sistema de autenticación**
4. **Personalizar según necesidades**

### Mejoras Opcionales

- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Login con Google/Facebook
- [ ] Roles y permisos avanzados
- [ ] 2FA (Two-Factor Authentication)
- [ ] Refresh token automático

---

**Bancamía** - El Banco de los que creen 💙

