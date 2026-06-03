import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
// ⚠️ KHI CHẠY LOCAL, THAY URL NÀY BẰNG URL NGROK
// Ví dụ: WEBHOOK_URL = 'https://abc123.ngrok.io/webhook';
const WEBHOOK_URL = 'https://5047-116-98-242-154.ngrok-free.app/webhook';

async function registerWebhook() {
  try {
    const response = await axios.post('https://api.circle.com/v1/webhooks', {
      url: WEBHOOK_URL,
      events: [
        'transaction.updated',
        'transaction.confirmed',
        'transaction.failed'
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${CIRCLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Webhook registered successfully!');
    console.log('Webhook ID:', response.data.data?.id);
  } catch (error) {
    console.error('❌ Error registering webhook:', error.response?.data || error.message);
  }
}

registerWebhook();