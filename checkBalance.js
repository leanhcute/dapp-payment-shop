import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const MY_API_KEY = "TEST_API_KEY:32548d716f657d9f6a5fad71fc60b157:1a9c762335d8b7dfd229ddfa7126538e";

// 🔴 DÁN CHÍNH XÁC WALLET ID CỦA BẠN VÀO ĐÂY (Cột đầu tiên trong ảnh Web của bạn, bấm copy mã e3fe5...396e)
const MY_WALLET_ID = "e3fe57e0-6c3a-5359-b462-fefbebf5396e"; 

const client = initiateDeveloperControlledWalletsClient({
  apiKey: MY_API_KEY,
});

async function run() {
  try {
    console.log("🚀 Đang truy vấn số dư tài khoản từ ví Circle...");

    const response = await client.getWalletTokenBalance({
      id: MY_WALLET_ID,
    });

    console.log("\n=========================================================");
    console.log("💰 THÔNG TIN SỐ DƯ VÍ CỦA BẠN:");
    
    if (response && response.data && response.data.tokenBalances) {
      response.data.tokenBalances.forEach((balance) => {
        console.log(`- Tài sản: ${balance.token.symbol} (${balance.token.name})`);
        console.log(`- Số dư khả dụng: ${balance.amount}`);
        console.log(`- Loại chuỗi: ${balance.token.blockchain}`);
        console.log("---------------------------------------------------------");
      });
    } else {
      console.log("Ví hiện tại đang trống (Số dư bằng 0).");
    }
    console.log("=========================================================");

  } catch (error) {
    console.log("\n❌ LỖI TRUY VẤN:", error.message);
  }
}

run();