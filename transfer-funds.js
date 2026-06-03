import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from 'dotenv';
dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function transferToPersonalWallet() {
  try {
    console.log("🚀 Đang khởi tạo chuyển tiền...");

    // 🔴 THAY BẰNG ĐỊA CHỈ VÍ METAMASK CÁ NHÂN CỦA BẢN
    const YOUR_PERSONAL_WALLET_ADDRESS = "0xAD20802f509D5181e01d0a06BD93661c2BB04bCd";
    
    const ADMIN_WALLET_ID = process.env.SHOP_WALLET_ID;
    const AMOUNT = "1"; // Chuyển 1 USDC
    const BLOCKCHAIN = "MATIC-AMOY"; // Thêm blockchain

    // Địa chỉ USDC trên Polygon Amoy Testnet
    const USDC_CONTRACT = "0xE9Fa0F8C3F1FcBA0A6f19242c87ce2cB169aD8E6";

    console.log(`📤 Chuẩn bị chuyển ${AMOUNT} USDC...`);
    console.log(`📥 Ví nhận: ${YOUR_PERSONAL_WALLET_ADDRESS}`);
    console.log(`💰 Ví gửi ID: ${ADMIN_WALLET_ID}`);
    console.log(`⛓️ Blockchain: ${BLOCKCHAIN}`);

    // Tạo giao dịch chuyển USDC với đầy đủ thông tin
    const transfer = await client.createTransaction({
      walletId: ADMIN_WALLET_ID,
      blockchain: BLOCKCHAIN,           // ⭐ THÊM blockchain
      tokenId: USDC_CONTRACT,           // ⭐ Dùng tokenId thay vì tokenAddress
      destinationAddress: YOUR_PERSONAL_WALLET_ADDRESS,
      amounts: [AMOUNT],
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" }
      }
    });

    console.log("\n✅ Đã tạo giao dịch!");
    console.log("Transaction ID:", transfer.data?.id);
    console.log("Trạng thái:", transfer.data?.state);
    
    if (transfer.data?.transaction?.txHash) {
      console.log(`🔗 Xem trên blockchain: https://amoy.polygonscan.com/tx/${transfer.data.transaction.txHash}`);
    }

  } catch (error) {
    console.error("\n❌ Lỗi chi tiết:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

transferToPersonalWallet();