'use client';

// Componente para proteger rutas que requieren autenticación
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login de admin
    if (!loading && !user) {
      console.log('🔒 Acceso denegado: redirigiendo a login');
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bancamia-azul-oscuro to-bancamia-azul-medio">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bancamia-naranja"></div>
            <p className="mt-4 text-white text-lg">Verificando autenticación...</p>
          </div>
        </div>
      )
    );
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null;
  }

  // Usuario autenticado, mostrar contenido protegido
  return <>{children}</>;
}

