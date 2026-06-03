import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function transferDirect() {
  try {
    const API_KEY = process.env.CIRCLE_API_KEY;
    const WALLET_ID = process.env.SHOP_WALLET_ID;
    
    // Endpoint đúng cho Developer Controlled Wallets
    const url = "https://api.circle.com/v1/w3s/transactions";
    
    const body = {
      idempotencyKey: `transfer-${Date.now()}`,
      destinationAddress: "0xAD20802f509D5181e01d0a06BD93661c2BB04bCd",
      amounts: ["1"],
      tokenId: "USDC",
      blockchain: "MATIC-AMOY",
      feeLevel: "MEDIUM",
      walletId: WALLET_ID
    };
    
    console.log("📤 Đang gửi request...");
    console.log("URL:", url);
    console.log("Body:", JSON.stringify(body, null, 2));
    
    const response = await axios.post(url, body, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("\n✅ Thành công!");
    console.log("Transaction ID:", response.data?.data?.id);
    console.log("Status:", response.data?.data?.state);
    
  } catch (error) {
    console.error("\n❌ Lỗi:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

transferDirect();