const axios = require('axios');
require('dotenv').config();

async function listWallets() {
  try {
    const response = await axios.get('https://api.circle.com/v1/wallets', {
      headers: {
        'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`
      }
    });
    
    const wallets = response.data.data.wallets;
    console.log('📋 Danh sách ví có sẵn:');
    wallets.forEach((wallet, index) => {
      console.log(`\n${index + 1}. Wallet ID: ${wallet.id}`);
      console.log(`   Address: ${wallet.address}`);
      console.log(`   Blockchain: ${wallet.blockchain}`);
    });
    
    if (wallets.length > 0) {
      console.log(`\n✅ Copy Wallet ID này: ${wallets[0].id}`);
    } else {
      console.log('\n⚠️ Không có ví nào. Cần tạo ví mới nhưng API key bị lỗi 403.');
    }
  } catch (error) {
    console.error('Lỗi:', error.response?.data || error.message);
  }
}

listWallets();