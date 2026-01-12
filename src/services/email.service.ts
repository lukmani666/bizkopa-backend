// import dotenv from 'dotenv';
// dotenv.config();

import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

const env = process.env.NODE_ENV;

if (env === 'production' && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const devTransporter = 
  env !== 'production'
    ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_SMTP_EMAIL,
        pass: process.env.GOOGLE_SMTP_PASSWORD
      }
    })
  : null;
export class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string
  ) {
    try {

      if (env === 'production') {
        return await sgMail.send({ 
          to, 
          from: "no-reply@bizkopa.com", 
          subject, 
          html 
        });
      } 

      if (!devTransporter) {
        throw new Error('Dev mail transporter not initialized');
      }

      await devTransporter.sendMail({
        from: `"Bizkopa" <${process.env.GOOGLE_SMTP_EMAIL}>`,
        to,
        subject,
        html
      });

      console.log(`[DEV EMAIL SENT] → ${to}`);
      return true;
    } catch (error) {
      console.error('[EMAIL ERROR]', error);
      throw error;
    }
  }
}