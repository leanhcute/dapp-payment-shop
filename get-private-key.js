import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function getPrivateKey() {
  try {
    const walletId = process.env.SHOP_WALLET_ID;
    console.log("📋 Đang lấy thông tin ví:", walletId);
    
    const response = await client.getWallet({ id: walletId });
    
    // In toàn bộ response để xem cấu trúc
    console.log("Full response:", JSON.stringify(response.data, null, 2));
    
    const wallet = response.data?.wallet;
    console.log("\nWallet ID:", wallet?.id);
    console.log("Address:", wallet?.address);
    
    // Thử các cách lấy private key khác nhau
    console.log("Private Key (cách 1):", wallet?.privateKey);
    console.log("Private Key (cách 2):", response.data?.privateKey);
    console.log("Private Key (cách 3):", wallet?.metadata?.privateKey);
    
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}

getPrivateKey();