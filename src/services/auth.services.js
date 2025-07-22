import bcrypt from "bcryptjs";
import * as UserModel from "../models/user.models.js";
import * as AuditModel from "../models/audit.models.js";
import * as EmailCodeModel from "../models/emailCode.models.js";
import generateToken from "../utils/token-generator.js";
import { sendVerificationEmail } from "../utils/mailer.js"; // Importamos la función de envío de correo

export async function registerUser(email, password, nombre) {
  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return null; // Devuelve null si el usuario ya existe
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Por defecto, el primer usuario es 'admin', los demás son 'user'
  const allUsers = await UserModel.getAllUsers();
  const rol = allUsers.length === 0 ? "admin" : "user";

  const newUser = await UserModel.createUser({
    email,
    password: hashedPassword,
    nombre,
    rol, // Asignamos el rol
    isEmailVerified: false
  });

  await sendVerificationCode(email); // Enviamos el código de verificación al email del nuevo usuario

  delete newUser.password; // No devolver la contraseña
  return newUser;
}

export async function loginUser(email, password) {
  const user = await UserModel.findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Credenciales inválidas, o usuario no registrado.");
  }

  if (!user.isEmailVerified) {
    throw new Error(
      "Debes verificar tu correo electrónico antes de iniciar sesión."
    );
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Credenciales inválidas.");
  }

  const tokenPayload = { id: user.id, email: user.email, rol: user.rol ,
    nombre: user.nombre};
  const token = generateToken(tokenPayload);

  return { token };
}

export async function changeUserPassword(userId, newPassword, adminUser) {
  const user = await UserModel.findUserById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Reutilizamos la función updateUser del modelo para actualizar solo la contraseña
  await UserModel.updateUser(userId, { password: hashedPassword });

  // Registrar el evento de cambio de contraseña en el log de auditoría
  try {
    await AuditModel.createLog({
      action: "ADMIN_PASSWORD_CHANGE",
      adminId: adminUser.id,
      adminEmail: adminUser.email,
      targetUserId: user.id,
      targetUserEmail: user.email,
    });
  } catch (logError) {
    // Si el log falla, no revertimos el cambio de contraseña, pero sí lo registramos en la consola.
    console.error(
      "Fallo al registrar el cambio de contraseña en la auditoría:",
      logError
    );
  }

  return true;
}

export async function sendVerificationCode(email) {
  const user = await UserModel.findUserByEmail(email); // Verificamos que el usuario exista
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generamos un código de 6 dígitos
  
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutos en milisegundos
  const expiresAt = Date.now() + FIVE_MINUTES;
  // Guardamos el código de verificación con su fecha de expiración
  //console.log(`Código de verificación generado: ${code} para el email: ${email}`);
  await EmailCodeModel.saveEmailCode(email, code, expiresAt); // Guardamos el código en la base de datos

  await sendVerificationEmail(email, code); // Enviamos el código por email
  
  return true;
}

export async function verifyEmailCode(email, code) {
  const data = await EmailCodeModel.getEmailCode(email); // Recuperamos el código de la base de datos
  if (!data) {
    console.log(`No se encontró ningún código de verificación para el email: ${email}`);
    await UserModel.deleteUserByEmail(email); // Eliminamos el usuario si el código no existe para ese usuario
    throw new Error("No se encontró ningún código de verificación para este correo.");
  }

  if (Date.now() > data.expiresAt) {
    await EmailCodeModel.deleteEmailCode(email); // Eliminamos el código expirado
    await UserModel.deleteUserByEmail(email); // Eliminamos el usuario si el código ha expirado
    throw new Error("El código de verificación ha expirado. Solicita uno nuevo.");
  }

  if (data.code !== code) {
    throw new Error("El código de verificación es incorrecto.");
  }
  await UserModel.updateUserByEmail(email, { isEmailVerified: true });

  await EmailCodeModel.deleteEmailCode(email); // Eliminamos el código después de la verificación exitosa
  return true;
}
export async function resetPasswordWithCode(email, newPassword) {
  const user = await UserModel.findUserByEmail(email); // Verificamos que el usuario exista
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10); // Hasheamos la nueva contraseña
  await UserModel.updateUser(user.id, { password: hashedPassword }); // Actualizamos la contraseña del usuario

  return true;
}
