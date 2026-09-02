import type { SettingsLocalization } from "@better-auth-ui/core";
import type { AuthLocalization } from "@better-auth-ui/core";
import type { PasskeyLocalization } from "@better-auth-ui/core/plugins/passkey";

export const authLocalization: Partial<AuthLocalization> = {
  signIn: "Iniciar Sesión",
  // signInDescription: "Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta",
  // signInAction: "Iniciar Sesión",
  // signInWith: "Iniciar Sesión con",
  // dontHaveAnAccount: "¿No tienes una cuenta?",
  continueWith: "Continuar con {{provider}}",

  signUp: "Regístrate",
  // signUpDescription: "Ingrese la información a continuación para crear una cuenta",
  // signUpAction: "Crear Cuenta",
  // signUpEmail: "Revisa tu correo electrónico para verificar tu cuenta",
  alreadyHaveAnAccount: "¿Ya tienes una cuenta?",
  needToCreateAnAccount: "¿Necesitas crear una cuenta?",

  forgotPassword: "Olvidé mi contraseña",
  forgotPasswordLink: "¿Olvidaste tu contraseña?",

  password: "Contraseña",
  passwordPlaceholder: "Escribe tu contraseña",
  passwordsDoNotMatch: "Las contraseñas no coinciden",
  // goBack: "Volver",
  // isRequired: "es obligatorio",
  // isInvalid: "no es válido",
  // save: "Guardar",
  // delete: "Eliminar",
  signOut: "Cerrar Sesión",

  // currentPassword: "Contraseña Actual",
  // currentPasswordPlaceholder: "Escribe tu contraseña actual",
  newPassword: "Nueva Contraseña",
  newPasswordPlaceholder: "Escribe tu nueva contraseña",
  // newPasswordRequired: "La nueva contraseña es requerida",
  // changePasswordInstructions: "Su contraseña debe tener al menos 8 caracteres.",

  // sessions: "Sesiones",
  // sessionsDescription: "Administre sus sesiones activas y revoque el acceso cuando sea necesario.",
  // revoke: "Revocar",

  // avatarDescription: "Haga clic en el avatar para cargar una nueva imagen.",
  // avatarInstructions: "El avatar es opcional pero es recomendable.",

  name: "Nombre",
  namePlaceholder: "Escribe tu nombre",
  // nameDescription: "Por favor ingrese su nombre completo, o un nombre para mostrar.",
  // nameInstructions: "Máximo 32 caracteres.",

  email: "Correo Electrónico",
  emailPlaceholder: "Escribe tu correo electrónico",
  // emailInstructions: "Ingrese una dirección de correo electrónico válida.",
};

export const settingsLocalization: Partial<SettingsLocalization> = {
  userProfile: "Perfil de Usuario",
  changeEmail: "Cambiar Email",
  changeAvatar: "Cambiar Avatar",
  changePassword: "Cambiar Contraseña",

  saveChanges: "Guardar Cambios",
  updateEmail: "Actualizar Email",
  updatePassword: "Actualizar Contraseña",
  uploadAvatar: "Subir Avatar",

  currentPassword: "Contraseña Actual",
  currentPasswordPlaceholder: "Escribe tu contraseña actual",

  activeSessions: "Sesiones Activas",
  currentSession: "Sesión Actual",
  revoke: "Revocar",

  delete: "Eliminar",
  cancel: "Cancelar",
  optional: "Opcional",
};

export const passkeyLocalization: Partial<PasskeyLocalization> = {
  name: "Nombre",
  passkeysDescription: "Gestione sus llaves de acceso para mayor seguridad y conveniencia.",
  addPasskey: "Agregar Llave de Acceso",
  passkey: "Llave de Acceso",
};
