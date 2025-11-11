"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialFormData, AutorizacionDatos } from "@/lib/types";
import { ciudadesNegocio } from "@/lib/ciudades-negocio";
import { autorizacionTratamientoDatos, autorizacionContacto } from "@/lib/authorizations";

export default function Home() {
  const [formData, setFormData] = useState<AutorizacionDatos>(initialFormData);
  const [enviado, setEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarAutorizacionCompleta, setMostrarAutorizacionCompleta] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Función para llenar el formulario con datos de prueba
  const llenarDatosPrueba = () => {
    const hoy = new Date();
    const fechaNacimiento = new Date(hoy.getFullYear() - 25, hoy.getMonth(), hoy.getDate());
    const fechaExpedicion = new Date(hoy.getFullYear() - 5, hoy.getMonth(), hoy.getDate());
    
    setFormData({
      email: "juan.perez@email.com",
      autorizacionTratamientoDatos: true,
      autorizacionContacto: true,
      nombreCompleto: "Juan Pérez García",
      tipoDocumento: "CC",
      numeroDocumento: "1234567890",
      fechaNacimiento: fechaNacimiento.toISOString().split('T')[0],
      fechaExpedicionDocumento: fechaExpedicion.toISOString().split('T')[0],
      ciudadNegocio: "201", // Plaza Minorista
      direccionNegocio: "Calle 123 #45-67",
      celularNegocio: "3001234567",
    });

    setError(null);
    setEnviado(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar autorizaciones
    if (!formData.autorizacionTratamientoDatos || !formData.autorizacionContacto) {
      setError("Debe aceptar todas las autorizaciones para continuar.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // Aquí iría la llamada a la API
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEnviado(true);
      setTimeout(() => {
        setFormData(initialFormData);
        setEnviado(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 5000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setError("Hubo un error inesperado al enviar el formulario. Por favor intenta de nuevo.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bancamía */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <Image
                  src="/Bancamia2-300x99.png"
                  alt="Bancamía - El Banco de los que creen"
                  width={220}
                  height={73}
                  priority
                  className="h-auto w-auto max-h-16"
                />
              </div>
              <div className="hidden md:block h-16 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <Image
                  src="/FMF.png"
                  alt="Fundación BBVA Microfinanzas"
                  width={300}
                  height={75}
                  priority
                  className="h-auto w-auto max-h-16"
                />
              </div>
            </div>
            <Link
              href="/admin/login"
              className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#2D5F8D] text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Banner Mejorado */}
      <div className="relative text-white py-16 md:py-20 overflow-hidden">
        {/* Imagen de fondo con blur */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/unnamed (3).jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(15px)',
            transform: 'scale(1.05)',
            zIndex: 0,
          }}
        ></div>
        
        {/* Overlay oscuro suave para legibilidad (reducido para que se vea la imagen) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/60 via-[#2D5F8D]/50 to-[#1E3A5F]/60 z-10"></div>
        
        {/* Patrón de fondo decorativo sutil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5 z-10"></div>
        
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9B2D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5F8D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 z-10"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-[#FFB85C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 z-10"></div>
        
        {/* Contenido del banner */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="text-center">
            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              <span className="block text-white drop-shadow-2xl mb-2">
                Autorización de Datos
              </span>
              <span className="block bg-gradient-to-r from-[#FF9B2D] via-[#FFB85C] to-[#FF9B2D] bg-clip-text text-transparent drop-shadow-lg animate-gradient text-3xl md:text-4xl lg:text-5xl">
                ¡Tu crédito te espera!
              </span>
            </h1>

            {/* Descripción */}
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-base md:text-lg text-blue-100 leading-relaxed px-2">
                Completa el formulario para autorizar la consulta en centrales de riesgo.
              </p>
            </div>

            {/* Indicadores visuales */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm md:text-base">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-[#FF9B2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-blue-100">Datos Seguros</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-[#FF9B2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-blue-100">Proceso Rápido</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-[#FF9B2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-blue-100">Confidencial</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Error al Enviar</h3>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-white hover:text-red-200 transition-colors"
                aria-label="Cerrar mensaje de error"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {enviado && (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">¡Autorización Enviada Exitosamente!</h3>
                <p className="text-green-100">Tu autorización ha sido registrada correctamente.</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 md:p-10">
          {/* Botón para llenar datos de prueba */}
          <div className="mb-6 flex justify-end border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={llenarDatosPrueba}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 border border-blue-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>⚡ Llenar con Datos de Prueba</span>
            </button>
          </div>

          {/* Información Personal */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9B2D] to-[#FFB85C] text-white font-bold text-lg shadow-lg mr-3">
                1
              </div>
              <h2 className="text-xl font-bold text-[#1E3A5F]">
                Información Personal
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                  placeholder="Juan Pérez García"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                  placeholder="correo@ejemplo.com"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="recordEmail"
                    className="h-4 w-4 text-[#FF9B2D] focus:ring-[#FF9B2D] border-gray-300 rounded"
                  />
                  <label htmlFor="recordEmail" className="ml-2 text-sm text-gray-600">
                    Recordar mi dirección de email con mi respuesta
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="PEP">Permiso Especial de Permanencia</option>
                  <option value="PPP">Permiso de Protección Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Expedición del Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaExpedicionDocumento"
                  value={formData.fechaExpedicionDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Información de Negocio */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D5F8D] text-white font-bold text-lg shadow-lg mr-3">
                2
              </div>
              <h2 className="text-xl font-bold text-[#1E3A5F]">
                Información de Negocio
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad de Negocio <span className="text-red-500">*</span>
                </label>
                <select
                  name="ciudadNegocio"
                  value={formData.ciudadNegocio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                >
                  <option value="">Seleccione una ciudad...</option>
                  {ciudadesNegocio.map((ciudad) => (
                    <option key={ciudad.codigo} value={ciudad.codigo}>
                      {ciudad.codigo} - {ciudad.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Negocio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccionNegocio"
                  value={formData.direccionNegocio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                  placeholder="Calle 123 #45-67"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Celular de Negocio <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="celularNegocio"
                  value={formData.celularNegocio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#FF9B2D] focus:border-[#FF9B2D] transition-all"
                  placeholder="3001234567"
                />
              </div>
            </div>
          </div>

          {/* Términos y Condiciones / Autorizaciones */}
          <div className="mb-8 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D5F8D] text-white font-bold text-lg shadow-lg mr-3">
                3
              </div>
              <h2 className="text-xl font-bold text-[#1E3A5F]">
                Autorizaciones y Términos
              </h2>
            </div>

            {/* Autorización Tratamiento de Datos */}
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl border-2 border-blue-200">
              <div className="mb-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="autorizacionTratamientoDatos"
                    checked={formData.autorizacionTratamientoDatos}
                    onChange={handleChange}
                    required
                    className="mt-1 h-5 w-5 text-[#FF9B2D] focus:ring-[#FF9B2D] border-gray-300 rounded transition-all flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#1E3A5F] group-hover:text-gray-900 transition-colors">
                      Autorización de Tratamiento de Datos Personales <span className="text-red-500">*</span>
                    </span>
                    <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {mostrarAutorizacionCompleta ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                          <p className="whitespace-pre-line">{autorizacionTratamientoDatos}</p>
                          <button
                            type="button"
                            onClick={() => setMostrarAutorizacionCompleta(false)}
                            className="text-[#FF9B2D] hover:text-[#E6881A] font-semibold"
                          >
                            Ver menos
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="line-clamp-3">
                            {autorizacionTratamientoDatos.substring(0, 200)}...
                          </p>
                          <button
                            type="button"
                            onClick={() => setMostrarAutorizacionCompleta(true)}
                            className="text-[#FF9B2D] hover:text-[#E6881A] font-semibold mt-1"
                          >
                            Leer autorización completa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Autorización Contacto */}
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl border-2 border-blue-200">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="autorizacionContacto"
                  checked={formData.autorizacionContacto}
                  onChange={handleChange}
                  required
                  className="mt-1 h-5 w-5 text-[#FF9B2D] focus:ring-[#FF9B2D] border-gray-300 rounded transition-all flex-shrink-0"
                />
                <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                  <strong className="text-[#1E3A5F]">{autorizacionContacto}</strong> <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-[#FF9B2D]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <span>Los campos marcados con <span className="text-red-500">*</span> son obligatorios</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative px-10 py-4 bg-gradient-to-r from-[#FF9B2D] to-[#FFB85C] hover:from-[#E6881A] hover:to-[#FF9B2D] text-white font-bold text-lg rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#FF9B2D]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Información de ayuda */}
        <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2D5F8D] to-[#1E3A5F] rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative p-8 text-white text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 mx-auto bg-[#FF9B2D] rounded-full flex items-center justify-center text-3xl shadow-lg">
                💬
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">¿Necesitas ayuda?</h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro equipo está disponible para asistirte
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="w-10 h-10 bg-[#FF9B2D] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-blue-200">Línea Nacional</p>
                  <p className="font-bold text-lg">018000126100</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="w-10 h-10 bg-[#FF9B2D] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-blue-200">WhatsApp</p>
                  <p className="font-bold text-lg">310 860 02 01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#1E3A5F] to-[#2D5F8D] text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm">
            <p>© Copyright 2025 – Bancamía. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs text-blue-200">El Banco de los que creen - Transformando realidades</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
