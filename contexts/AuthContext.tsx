'use client';

// Context API para manejar autenticación global en la aplicación
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import authService, { User, RegisterData } from '@/lib/auth.service';

// Tipos para el contexto
interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Observar cambios en Firebase Auth y renovar tokens automáticamente
  useEffect(() => {
    console.log('🔄 Inicializando observador de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Estado de Firebase Auth cambió:', firebaseUser?.email || 'sin usuario');
      
      setFirebaseUser(firebaseUser);
      
      // Establecer usuario actual en authService
      authService.setCurrentFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        // Firebase renueva automáticamente el token cuando expire
        // Obtener el token para asegurar que esté actualizado
        try {
          const idToken = await firebaseUser.getIdToken();
          console.log('🎫 Token de Firebase obtenido/renovado');
          
          // Verificar si tenemos usuario guardado
          const savedUser = authService.getCurrentUser();
          
          if (savedUser) {
            // Ya tenemos usuario guardado, usarlo
            setUser(savedUser);
            console.log('✅ Usuario restaurado desde localStorage');
          } else {
            // No tenemos usuario guardado, obtener perfil del backend
            try {
              console.log('🔄 Obteniendo perfil del backend...');
              const profile = await authService.getProfile();
              setUser(profile);
              console.log('✅ Perfil obtenido del backend');
            } catch (err) {
              console.error('❌ Error al obtener perfil:', err);
              // Si falla, intentar verificar el token
              try {
                const verifiedUser = await authService.verify(idToken);
                setUser(verifiedUser);
                console.log('✅ Token verificado, usuario obtenido');
              } catch (verifyErr) {
                console.error('❌ Error al verificar token:', verifyErr);
                // Si también falla la verificación, limpiar sesión
                await authService.logout();
                setUser(null);
              }
            }
          }
        } catch (tokenError) {
          console.error('❌ Error al obtener token:', tokenError);
          setUser(null);
        }
      } else {
        // No hay usuario en Firebase
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Intentando login...');
      const response = await authService.login(email, password);
      
      setUser(response.user);
      console.log('✅ Login exitoso');
    } catch (err) {
      console.error('❌ Error en login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Intentando registro...');
      await authService.register(data);
      
      // Después del registro, hacer login automático
      console.log('🔐 Login automático después de registro...');
      await login(data.email, data.password);
      
      console.log('✅ Registro exitoso');
    } catch (err) {
      console.error('❌ Error en registro:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👋 Cerrando sesión...');
      await authService.logout();
      
      setUser(null);
      setFirebaseUser(null);
      
      console.log('✅ Sesión cerrada');
    } catch (err) {
      console.error('❌ Error en logout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;

