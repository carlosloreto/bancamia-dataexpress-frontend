# 🔐 Credenciales de Prueba - Sistema de Autenticación

## 📋 Usuario de Prueba

### Credenciales para Login:

```
Email:    carlosloreto@gmail.com
Password: Cc123456
```

---

## 🧪 Cómo Probar el Sistema

### 1️⃣ **Registro** (Si el usuario no existe)

1. Ve a: `http://localhost:3000/register`
2. Completa:
   - **Nombre**: Carlos Loreto
   - **Email**: `carlosloreto@gmail.com`
   - **Contraseña**: `Cc123456`
   - **Confirmar Contraseña**: `Cc123456`
3. Click en **"Crear Cuenta"**
4. El sistema:
   - Crea usuario en Firebase
   - Registra en la API backend
   - Hace login automático
   - Redirige a `/admin`

---

### 2️⃣ **Login** (Si el usuario ya existe)

1. Ve a: `http://localhost:3000/admin/login`
2. Ingresa:
   - **Email**: `carlosloreto@gmail.com`
   - **Contraseña**: `Cc123456`
3. Click en **"Iniciar Sesión"**
4. El sistema:
   - Autentica con Firebase
   - Obtiene token del backend
   - Redirige a `/admin`

---

### 3️⃣ **Acceder al Panel de Admin**

1. Una vez logueado, ve a: `http://localhost:3000/admin`
2. Deberías ver:
   - Tu email en el header
   - Panel de solicitudes
   - Estadísticas
   - Botón "Cerrar Sesión"

---

### 4️⃣ **Cerrar Sesión**

1. En el panel `/admin`, click en **"Cerrar Sesión"**
2. Confirma la acción
3. El sistema:
   - Cierra sesión en Firebase
   - Limpia localStorage
   - Redirige a `/admin/login`

---

## 🔍 Verificación en Firebase Console

Puedes verificar el usuario en Firebase:

**URL**: `https://console.firebase.google.com/project/bancamia-dataexpress-test/authentication/users`

Deberías ver:
- **UID**: (generado automáticamente)
- **Email**: carlosloreto@gmail.com
- **Created**: (fecha de creación)
- **Provider**: Email/Password

---

## 🐛 Posibles Errores y Soluciones

### Error: "Usuario no encontrado"
**Causa**: El usuario no existe en Firebase  
**Solución**: Registra el usuario primero en `/register`

### Error: "Contraseña incorrecta"
**Causa**: La contraseña no coincide  
**Solución**: Verifica que sea exactamente `Cc123456` (case-sensitive)

### Error: "El email ya está registrado"
**Causa**: El usuario ya existe  
**Solución**: Usa `/admin/login` en lugar de `/register`

### Error: "Error al conectar con el servidor"
**Causa**: La API backend no responde  
**Solución**: Verifica que `NEXT_PUBLIC_API_URL` esté correcta en `.env.local`

---

## 📊 Flujo Completo del Login

```
Usuario ingresa credenciales
    ↓
Firebase Auth valida email/password
    ↓
Obtiene idToken de Firebase
    ↓
POST /api/v1/auth/login { idToken }
    ↓
Backend verifica idToken
    ↓
Backend retorna JWT
    ↓
Frontend guarda JWT en localStorage
    ↓
Usuario redirigido a /admin ✅
```

---

## 🔒 Seguridad

- ✅ Contraseña nunca se envía al backend (solo idToken)
- ✅ Firebase maneja la autenticación
- ✅ Backend valida el token de Firebase
- ✅ JWT se usa para peticiones autenticadas
- ✅ Tokens se guardan en localStorage
- ✅ Sesión se limpia al hacer logout

---

## 📝 Notas Importantes

1. **Primera vez**: Usa `/register` para crear la cuenta
2. **Siguientes veces**: Usa `/admin/login` para acceder
3. **Contraseña mínima**: 6 caracteres (requisito de Firebase)
4. **Email único**: No se pueden duplicar emails
5. **Recordarme**: Guarda el email en localStorage (opcional)

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}

**Estado**: ✅ Sistema funcionando correctamente

