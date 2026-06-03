import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
const SHOP_WALLET_ID = process.env.SHOP_WALLET_ID;

export async function createPaymentRequest(amount, customerWalletId, orderId) {
  try {
    // Tạo payment request (chỉ tạo yêu cầu, không thực hiện chuyển tiền)
    const response = await axios.post('https://api.circle.com/v1/payments', {
      idempotencyKey: `pay-${orderId}`,
      amount: {
        amount: amount.toString(),
        currency: 'USD'
      },
      destination: {
        type: 'blockchain',
        address: '0x384f1edbb745e2e3ec7d0d5da810c0abc56ed4e1', // Địa chỉ ví shop từ createWalletSDK.js
        chain: 'MATIC-AMOY'
      },
      source: {
        type: 'wallet',
        id: customerWalletId
      }
    }, {
      headers: {
        'Authorization': `Bearer ${CIRCLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}