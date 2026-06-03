import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import crypto from "crypto";
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

const MY_API_KEY = process.env.CIRCLE_API_KEY;
const MY_ENTITY_SECRET = process.env.CIRCLE_ENTITY_SECRET;

const client = initiateDeveloperControlledWalletsClient({
  apiKey: MY_API_KEY,
  entitySecret: MY_ENTITY_SECRET
});

async function run() {
  try {
    console.log("🚀 Đang khởi tạo Wallet Set...");

    const walletSetResponse = await client.createWalletSet({
      name: "ARC-Primary-Set",
      idempotencyKey: crypto.randomUUID()
    });

    const targetWalletSetId = walletSetResponse.data.walletSet.id;
    console.log(`✅ Wallet Set ID: ${targetWalletSetId}`);

    console.log("🚀 Đang tạo ví...");

    const walletResponse = await client.createWallets({
      blockchains: ["MATIC-AMOY"],
      walletSetId: targetWalletSetId,
      count: 1,
      idempotencyKey: crypto.randomUUID()
    });

    const wallet = walletResponse.data.wallets[0];
    
    console.log("\n=================================================");
    console.log("🎉 TẠO VÍ THÀNH CÔNG!");
    console.log(`Wallet Set ID: ${targetWalletSetId}`);
    console.log(`WALLET ID: ${wallet.id}`);
    console.log(`Địa chỉ: ${wallet.address}`);
    console.log("=================================================");
    
    // Lưu vào file
    writeFileSync('my-wallet.json', JSON.stringify(wallet, null, 2));
    console.log("\n💾 Đã lưu wallet info vào file my-wallet.json");
    
  } catch (error) {
    console.log("\n❌ LỖI:", error.message);
    if (error.response) {
      console.log("Chi tiết:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

run();