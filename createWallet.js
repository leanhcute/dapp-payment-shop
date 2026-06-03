import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import crypto from "crypto";

// 🔴 1. API KEY CHUẨN CỦA BẠN
const MY_API_KEY = "TEST_API_KEY:32548d716f657d9f6a5fad71fc60b157:1a9c762335d8b7dfd229ddfa7126538e";

// 🔴 2. CHUỖI ENTITY SECRET BẠN ĐÃ ĐĂNG KÝ TRÊN WEB (Chuỗi Hex gồm 64 ký tự)
const MY_ENTITY_SECRET = "6e0d38f36613558dca33498a80c0ebb2fc7cee5ea4396563380fd2b0fea9ec3d";

// Khởi tạo client cấu hình đầy đủ cả API Key lẫn Entity Secret gốc
const client = initiateDeveloperControlledWalletsClient({
  apiKey: MY_API_KEY,
  entitySecret: MY_ENTITY_SECRET // SDK sẽ tự bóc tách chuỗi này để tự tạo Ciphertext ngầm bên dưới
});

async function run() {
  try {
    console.log("🚀 Bước 1: Đang khởi tạo Nhóm ví (Wallet Set) thông qua SDK...");

    // Sinh mã Idempotency ngẫu nhiên bằng crypto
    const idempotencyKey = crypto.randomUUID();

    const walletSetResponse = await client.createWalletSet({
      name: "ARC-Primary-Set",
      idempotencyKey: idempotencyKey
    });

    const targetWalletSetId = walletSetResponse.data.walletSet.id;
    console.log(`✅ Tạo Wallet Set thành công! ID nhóm ví của bạn là: ${targetWalletSetId}`);
    console.log("---------------------------------------------------------");

    console.log("🚀 Bước 2: Tiến hành đúc và khởi tạo Ví Blockchain Polygon Amoy...");

   const walletResponse = await client.createWallets({
      blockchains: ["MATIC-AMOY"], // 🌟 Đổi chính xác thành MATIC-AMOY viết IN HOA
      walletSetId: targetWalletSetId,
      count: 1,
      idempotencyKey: crypto.randomUUID()
    });
    if (walletResponse && walletResponse.data && walletResponse.data.wallets && walletResponse.data.wallets.length > 0) {
      const wallet = walletResponse.data.wallets[0];
      
      console.log("\n=========================================================");
      console.log("🎉 XIN CHÚC MỪNG! BẠN ĐÃ TẠO VÍ BLOCKCHAIN THÀNH CÔNG!");
      console.log(`- Mã Nhóm ví (Wallet Set ID): ${targetWalletSetId}`);
      console.log(`- Mã ID của Ví (Wallet ID): ${wallet.id}`);
      console.log(`- ĐỊA CHỈ VÍ BLOCKCHAIN (ADDRESS): ${wallet.address}`);
      console.log("=========================================================");
      console.log("💡 BƯỚC TIẾP THEO:");
      console.log(`👉 Hãy copy địa chỉ ví: ${wallet.address}`);
      console.log("👉 Bạn có thể quay lại Web Circle F5 lại trang 'Wallets' để nhìn thấy ví!");
      console.log("=========================================================");
    }

  } catch (error) {
    console.log("\n❌ PHÁT HIỆN LỖI PHẢN HỒI:");
    if (error.response) {
      console.log("Chi tiết lỗi từ Circle Server:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Thông điệp lỗi:", error.message);
    }
  }
}

run();