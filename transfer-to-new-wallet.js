import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function transferToNewWallet() {
  try {
    // Ví Admin (gửi tiền)
    const ADMIN_WALLET_ID = process.env.SHOP_WALLET_ID;
    
    // Địa chỉ ví nhận (blockchain address)
    const RECIPIENT_ADDRESS = "0x6d85172477565feb018cfb2b37406be7bbc19881";
    
    const AMOUNT = "1";
    const BLOCKCHAIN = "MATIC-AMOY";
    
    // Token ID cho USDC trên MATIC-AMOY (dạng UUID)
    // Lấy từ Circle Console hoặc dùng token mặc định
    const USDC_TOKEN_ID = "b9d0c8c4-9e6a-4e8f-9a3c-123456789abc"; // Thay bằng token ID thật
    
    console.log("🚀 Đang tạo giao dịch chuyển tiền...");
    console.log(`📤 Từ ví Admin: ${ADMIN_WALLET_ID}`);
    console.log(`📥 Đến địa chỉ: ${RECIPIENT_ADDRESS}`);
    console.log(`💰 Số tiền: ${AMOUNT} USDC`);
    
    // Tạo transaction đến địa chỉ blockchain
    const response = await client.createTransaction({
      walletId: ADMIN_WALLET_ID,
      destinationAddress: RECIPIENT_ADDRESS,
      destinationBlockchain: BLOCKCHAIN,
      amounts: [AMOUNT],
      tokenId: USDC_TOKEN_ID,
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

transferToNewWallet();