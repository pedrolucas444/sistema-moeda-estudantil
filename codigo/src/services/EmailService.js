const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this._mockedEmails = [];
    this.mock = false;

    // Determine transport strategy: explicit SMTP, Gmail, or mock
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Generic SMTP transport
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: (process.env.SMTP_SECURE || 'false') === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        // Gmail transport
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });
      } else {
        // No credentials — run in mock mode
        this.mock = true;
        console.warn('EmailService: running in MOCK mode (no SMTP/GMAIL credentials found)');
      }
    } catch (err) {
      console.error('EmailService init error, switching to mock mode:', err);
      this.mock = true;
    }

    this.from = process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER || 'no-reply@example.com';
  }

  async sendMail({ to, subject, text, html }) {
    if (this.mock || !this.transporter) {
      const mock = { to, subject, text, html: html || text, from: this.from, date: new Date().toISOString() };
      this._mockedEmails.push(mock);
      console.log('EmailService MOCK send:', mock);
      return mock;
    }

    return this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
      html: html || text
    });
  }
}

module.exports = EmailService;