import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function transferByAPI() {
  try {
    const API_KEY = process.env.CIRCLE_API_KEY;
    const WALLET_ID = process.env.SHOP_WALLET_ID;
    
    // Địa chỉ ví nhận (ví MetaMask của bạn)
    const RECIPIENT = "0xAD20802f509D5181e01d0a06BD93661c2BB04bCd";
    
    // Số tiền chuyển (USDC)
    const AMOUNT = "1";
    
    // Endpoint chính xác cho Developer Controlled Wallets
    const url = "https://api.circle.com/v1/w3s/transactions";
    
    const payload = {
      idempotencyKey: `transfer-${Date.now()}-${Math.random()}`,
      walletId: WALLET_ID,
      destinationAddress: RECIPIENT,
      amounts: [AMOUNT],
      tokenId: "USDC",
      blockchain: "MATIC-AMOY",
      feeLevel: "MEDIUM"
    };
    
    console.log("📤 Đang chuyển tiền...");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    
    const response = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("\n✅ CHUYỂN TIỀN THÀNH CÔNG!");
    console.log("Transaction ID:", response.data?.data?.id);
    console.log("Status:", response.data?.data?.state);
    
    if (response.data?.data?.transactionHash) {
      console.log(`🔗 Xem trên blockchain: https://amoy.polygonscan.com/tx/${response.data.data.transactionHash}`);
    }
    
  } catch (error) {
    console.error("\n❌ LỖI:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

transferByAPI();