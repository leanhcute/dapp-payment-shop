import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function exportWallet() {
  try {
    const walletId = process.env.SHOP_WALLET_ID;
    
    // Export private key
    const response = await client.exportWallet({
      walletId: walletId,
      destinationType: "DEVELOPER"
    });
    
    console.log("Private Key:", response.data?.privateKey);
    console.log("Address:", response.data?.address);
    
  } catch (error) {
    console.error("Lỗi:", error.message);
    if (error.response) {
      console.error("Chi tiết:", error.response.data);
    }
  }
}

exportWallet();