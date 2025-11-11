// Tipos de datos para el formulario de autorización de datos Bancamía
// Basado en el formulario oficial de Google Forms

export interface AutorizacionDatos {
  id?: string;
  fechaSolicitud?: string;
  
  // Email
  email: string;
  
  // Autorizaciones (requeridas)
  autorizacionTratamientoDatos: boolean;
  autorizacionContacto: boolean;
  
  // Información Personal
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  fechaExpedicionDocumento: string;
  
  // Información de Negocio
  ciudadNegocio: string;
  direccionNegocio: string;
  celularNegocio: string;
}

export const initialFormData: AutorizacionDatos = {
  // Email
  email: "",
  
  // Autorizaciones
  autorizacionTratamientoDatos: false,
  autorizacionContacto: false,
  
  // Información Personal
  nombreCompleto: "",
  tipoDocumento: "CC",
  numeroDocumento: "",
  fechaNacimiento: "",
  fechaExpedicionDocumento: "",
  
  // Información de Negocio
  ciudadNegocio: "",
  direccionNegocio: "",
  celularNegocio: "",
};


