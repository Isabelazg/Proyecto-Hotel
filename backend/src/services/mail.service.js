import nodemailer from 'nodemailer';

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_NAME,
  MAIL_FROM_EMAIL,
  APP_NAME,
} = process.env;

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT ? Number(MAIL_PORT) : 2525,
  auth: MAIL_USERNAME && MAIL_PASSWORD
    ? { user: MAIL_USERNAME, pass: MAIL_PASSWORD }
    : undefined,
  secure: false,
});

const defaultFrom = {
  name: MAIL_FROM_NAME || APP_NAME || 'Hotel',
  address: MAIL_FROM_EMAIL || 'no-reply@hotel.local',
};

export const sendMail = async ({ to, subject, html, text }) => {
  return await transport.sendMail({
    from: defaultFrom,
    to,
    subject,
    html,
    text,
  });
};

export const sendWelcomeEmail = async ({ correo, nombre, apellido }) => {
  const fullName = `${nombre || ''} ${apellido || ''}`.trim();
  const subject = `Bienvenido a ${APP_NAME || 'Hotel'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>¡Hola ${fullName || 'usuario'}!</h2>
      <p>Tu cuenta fue registrada correctamente.</p>
      <p>Ya puedes iniciar sesión en la plataforma.</p>
      <p>— Equipo ${APP_NAME || 'Hotel'}</p>
    </div>
  `;

  return await sendMail({
    to: correo,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async ({ correo, nombre, apellido, resetLink }) => {
  const fullName = `${nombre || ''} ${apellido || ''}`.trim();
  const subject = `Restablecer contraseña - ${APP_NAME || 'Hotel'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hola ${fullName || 'usuario'}</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener noreferrer">Restablecer contraseña</a></p>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      <p>— Equipo ${APP_NAME || 'Hotel'}</p>
    </div>
  `;

  return await sendMail({
    to: correo,
    subject,
    html,
  });
};