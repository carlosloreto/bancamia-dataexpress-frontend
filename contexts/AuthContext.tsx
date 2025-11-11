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

  // Observar cambios en Firebase Auth
  useEffect(() => {
    console.log('🔄 Inicializando observador de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Estado de Firebase Auth cambió:', firebaseUser?.email || 'sin usuario');
      
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        // Verificar si tenemos token del backend
        const token = authService.getToken();
        const savedUser = authService.getCurrentUser();
        
        if (token && savedUser) {
          // Ya tenemos token y usuario guardado
          setUser(savedUser);
          console.log('✅ Usuario restaurado desde localStorage');
        } else {
          // No tenemos token, intentar obtener perfil del backend
          try {
            console.log('🔄 Obteniendo perfil del backend...');
            const profile = await authService.getProfile();
            setUser(profile);
            console.log('✅ Perfil obtenido del backend');
          } catch (err) {
            console.error('❌ Error al obtener perfil:', err);
            // Si falla, limpiar sesión
            await authService.logout();
            setUser(null);
          }
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

