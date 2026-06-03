import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

// 🔴 1. API KEY CHUẨN CỦA BẠN
const MY_API_KEY = "TEST_API_KEY:32548d716f657d9f6a5fad71fc60b157:1a9c762335d8b7dfd229ddfa7126538e";

// 🔴 2. CHUỖI ENTITY SECRET BẠN ĐÃ ĐĂNG KÝ TRÊN WEB
const MY_ENTITY_SECRET = "6e0d38f36613558dca33498a80c0ebb2fc7cee5ea4396563380fd2b0fea9ec3d";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: MY_API_KEY,
});

async function run() {
  try {
    console.log("🚀 Đang tiến hành tạo Nhóm ví (Wallet Set) chính thức...");

    // Cấu trúc truyền tham số chuẩn xác nhất để không bị sập hàm hexToBytes nội bộ
    const response = await client.createWalletSet({
      name: "ARC-Primary-Set",
      entitySecret: MY_ENTITY_SECRET // Gắn trực tiếp mã bí mật bạn đã đăng ký trên web
    });

    console.log("\n=========================================================");
    console.log("🎉 XIN CHÚC MỪNG! TẠO WALLET SET THÀNH CÔNG!");
    console.log(`👉 WALLET_SET_ID MỚI CỦA BẠN: ${response.data.walletSet.id}`);
    console.log("=========================================================");
    console.log("💡 BƯỚC TIẾP THEO:");
    console.log("1. Hãy copy chuỗi WALLET_SET_ID ở trên.");
    console.log("2. Quay lại file 'createWallet.js' (file quét danh sách lúc nãy), dán trực tiếp ID này vào code để tạo ví!");
    console.log("=========================================================");

  } catch (error) {
    console.log("\n❌ PHÁT HIỆN LỖI:");
    if (error.response) {
      console.log("Nội dung phản hồi từ Server Circle:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Thông điệp lỗi:", error.message);
    }
  }
}

run();