const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Se tiver SMTP configurado via .env, usa. Se não tiver, vamos usar modo MOCK.
    const hasSmtp =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    this.mock = !hasSmtp;

    if (!this.mock) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    this.from = process.env.EMAIL_FROM || 'MeritCoins <no-reply@meritcoins.com>';
  }

  async sendMail({ to, subject, text, html }) {
    // Modo MOCK: só loga no console e não tenta enviar nada de verdade
    if (this.mock) {
      console.log('---------------------------');
      console.log('[EmailService MOCK]');
      console.log('Para:', to);
      console.log('Assunto:', subject);
      console.log('Texto:', text);
      console.log('---------------------------');
      return { mocked: true };
    }

    const mailOptions = {
      from: this.from,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}

module.exports = EmailService;
