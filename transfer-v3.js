import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function transferV3() {
  try {
    const API_KEY = process.env.CIRCLE_API_KEY;
    const WALLET_ID = process.env.SHOP_WALLET_ID;
    
    const url = "https://api.circle.com/v1/developer/transactions";
    
    const payload = {
      idempotencyKey: `tx-${Date.now()}`,
      walletId: WALLET_ID,
      destination: {
        address: "0xAD20802f509D5181e01d0a06BD93661c2BB04bCd",
        blockchain: "MATIC-AMOY"
      },
      amounts: ["1"],
      tokenId: "USDC",
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" }
      }
    };
    
    console.log("📤 Đang gửi...");
    const response = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("✅ Thành công:", response.data);
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}

transferV3();