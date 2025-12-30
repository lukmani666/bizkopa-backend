// import dotenv from 'dotenv';
// dotenv.config();

import sgMail from '@sendgrid/mail';

const env = process.env.NODE_ENV;

if (env === 'production' && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string
  ) {
    if (env === 'production') {
      return sgMail.send({ to, from: "no-reply@bizkopa.com", subject, html });
    } else {
      console.log('DEV EMAIL:', { to, subject, html });
      return true;
    }
  }
}