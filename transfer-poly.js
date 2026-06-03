import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function transferPOL() {
  try {
    const ADMIN_WALLET_ID = process.env.SHOP_WALLET_ID;
    const RECIPIENT_ADDRESS = "0x6d85172477565feb018cfb2b37406be7bbc19881";
    const AMOUNT = "0.1"; // POL
    const BLOCKCHAIN = "MATIC-AMOY";
    
    // Token POL (native coin) - không cần tokenId
    console.log("🚀 Chuyển POL...");
    
    const response = await client.createTransaction({
      walletId: ADMIN_WALLET_ID,
      destinationAddress: RECIPIENT_ADDRESS,
      destinationBlockchain: BLOCKCHAIN,
      amounts: [AMOUNT],
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" }
      }
      // Không có tokenId - sẽ chuyển native coin (POL)
    });
    
    console.log("✅ Thành công:", response.data?.id);
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
}

transferPOL();