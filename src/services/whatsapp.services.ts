// import dotenv from 'dotenv';
// dotenv.config();
import axios from "axios";

const env = process.env.NODE_ENV;

export class WhatsAppService {
  static async sendMessage(phone: string, message: string) {
    if (env === 'production') {
      const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
      await axios.post(url, {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'text',
        text: { body: message }
      }, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.log('DEV WHATSAPP MESSAGE:', { phone, message });
    }
  }
}