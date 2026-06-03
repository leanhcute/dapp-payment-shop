import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function transferCorrect() {
  try {
    // Ví Admin (gửi tiền)
    const ADMIN_WALLET_ID = process.env.SHOP_WALLET_ID;
    
    // Ví nhận - cần có Wallet ID (không phải địa chỉ blockchain)
    // Tạo ví nhận trước bằng: node createWalletSDK.js
    const RECIPIENT_WALLET_ID = "0195c4a2-1234-5678-9abc-def012345678"; // 🔴 THAY BẰNG WALLET ID THẬT
    
    const AMOUNT = "1";
    
    console.log("🚀 Đang tạo giao dịch chuyển tiền...");
    console.log(`Từ ví Admin: ${ADMIN_WALLET_ID}`);
    console.log(`Đến ví: ${RECIPIENT_WALLET_ID}`);
    console.log(`Số tiền: ${AMOUNT} USDC`);
    
    // Tạo transaction giữa 2 wallets
    const response = await client.createTransaction({
      walletId: ADMIN_WALLET_ID,
      destination: {
        type: "wallet",
        id: RECIPIENT_WALLET_ID
      },
      amounts: [AMOUNT],
      tokenId: "USDC",
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" }
      }
    });
    
    console.log("\n✅ GIAO DỊCH ĐÃ ĐƯỢC TẠO!");
    console.log("Transaction ID:", response.data?.id);
    console.log("Status:", response.data?.state);
    
  } catch (error) {
    console.error("\n❌ LỖI:");
    console.error(error.message);
    if (error.response) {
      console.error("Chi tiết:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

transferCorrect();