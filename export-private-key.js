import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function exportPrivateKey() {
  try {
    const API_KEY = process.env.CIRCLE_API_KEY;
    const WALLET_ID = process.env.SHOP_WALLET_ID;
    
    const response = await axios.post(
      `https://api.circle.com/v1/w3s/wallets/${WALLET_ID}/export`,
      {
        destinationType: "DEVELOPER"
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("✅ Private Key:", response.data?.data?.privateKey);
    console.log("Địa chỉ:", response.data?.data?.address);
    
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}

exportPrivateKey();