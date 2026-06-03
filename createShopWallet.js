const axios = require('axios');
require('dotenv').config();

async function createShopWallet() {
  try {
    console.log('🔄 Đang tạo ví shop...');
    
    const response = await axios.post('https://api.circle.com/v1/wallets', {
      idempotencyKey: `shop-${Date.now()}`,
      blockchains: ['MATIC-AMOY'],
      accountType: 'EOA'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Tạo ví thành công!');
    console.log('=================================================');
    console.log('🏪 SHOP WALLET ID:', response.data.data.walletId);
    console.log('📫 Địa chỉ ví:', response.data.data.address);
    console.log('⛓️ Blockchain:', response.data.data.blockchain);
    console.log('=================================================');
    
    // Lưu vào file để dùng sau
    const fs = require('fs');
    fs.writeFileSync('shop-wallet.json', JSON.stringify(response.data.data, null, 2));
    console.log('\n💾 Đã lưu vào file: shop-wallet.json');
    console.log('\n📋 Hãy copy WALLET ID trên để thêm vào file .env');
    
  } catch (error) {
    console.error('\n❌ Lỗi:', error.response?.data || error.message);
  }
}

createShopWallet();