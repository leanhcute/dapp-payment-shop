import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function listTokens() {
  try {
    const API_KEY = process.env.CIRCLE_API_KEY;
    
    const response = await axios.get("https://api.circle.com/v1/tokens", {
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    });
    
    console.log("Danh sách tokens:");
    const tokens = response.data?.data?.tokens;
    
    // Lọc USDC trên MATIC-AMOY
    const usdcTokens = tokens.filter(t => 
      t.symbol === "USDC" && t.blockchain === "MATIC-AMOY"
    );
    
    console.log(JSON.stringify(usdcTokens, null, 2));
    
    if (usdcTokens.length > 0) {
      console.log("\n✅ Token ID cho USDC:", usdcTokens[0].id);
    }
    
  } catch (error) {
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

listTokens();