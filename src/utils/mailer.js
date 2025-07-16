// utils/mailer.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, code) {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Verificación de Email - API Monitoreo',
    html: `
      <h3>Hola!</h3>
      <p>Tu código de verificación es: <b>${code}</b></p>
      <p>Este código vence en 15 minutos. No lo compartas con nadie.</p>
    `,
  });

  if (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el email de verificación');
  }

  return data;
}
