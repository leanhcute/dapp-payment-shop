import express from 'express';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import { createPaymentRequest } from './payment.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Đảm bảo thư mục public tồn tại
const publicDir = join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
// API: Lấy địa chỉ ví Admin (cho frontend)
app.get('/api/admin-wallet', (req, res) => {
  const adminWallet = process.env.ADMIN_WALLET_ADDRESS || '';
  res.json({ adminWallet: adminWallet.toLowerCase() });
});

// ========== ĐỌC SẢN PHẨM ==========
let products = [];
try {
  const data = fs.readFileSync('products.json', 'utf8');
  products = JSON.parse(data).products;
  console.log('✅ Đã tải', products.length, 'sản phẩm');
} catch (error) {
  console.error('❌ Lỗi đọc products.json:', error.message);
  products = [];
}

// ========== API SẢN PHẨM ==========
app.get('/api/products', (req, res) => {
  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }
  res.json({ product });
});

// API: Thêm sản phẩm mới
app.post('/api/products', (req, res) => {
  const { name, price, description, stock } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Thiếu tên hoặc giá sản phẩm' });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    description: description || '',
    image: 'https://via.placeholder.com/150',
    stock: stock || 0
  };
  
  products.push(newProduct);
  fs.writeFileSync('products.json', JSON.stringify({ products }, null, 2));
  res.json({ success: true, product: newProduct });
});

// API: Xóa sản phẩm
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }
  
  products.splice(index, 1);
  fs.writeFileSync('products.json', JSON.stringify({ products }, null, 2));
  res.json({ success: true });
});

// API: Tạo payment request
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, customerWalletId, orderId, productName } = req.body;
    
    if (!customerWalletId) {
      return res.status(400).json({ success: false, error: 'Thiếu customerWalletId' });
    }
    
    const transaction = await createPaymentRequest(amount, customerWalletId, orderId);
    
    const paymentUrl = transaction.data.transaction.transactionUrl || 
                      `https://explorer.circle.com/tx/${transaction.data.transaction.id}`;
    const qrImage = await QRCode.toDataURL(paymentUrl);
    
    res.json({
      success: true,
      transactionId: transaction.data.transaction.id,
      qrImage: qrImage,
      paymentUrl: paymentUrl,
      productName: productName
    });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Tạo request payment cho sản phẩm
app.post('/api/request-payment/:productId', async (req, res) => {
  try {
    const { customerWalletId } = req.body;
    const product = products.find(p => p.id == req.params.productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    if (!customerWalletId) {
      return res.status(400).json({ error: 'Thiếu customerWalletId' });
    }
    
    const transaction = await createPaymentRequest(product.price, customerWalletId, Date.now());
    const qrCode = await QRCode.toDataURL(transaction.data.transaction.transactionUrl);
    
    res.json({ 
      qrCode, 
      paymentData: {
        productName: product.name,
        amount: product.price,
        transactionId: transaction.data.transaction.id
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========== WEBHOOK HANDLER ==========
// Hàm xử lý transaction thành công
async function handleTransactionUpdate(event) {
  const transaction = event.data?.transaction;
  if (!transaction) return;
  
  const transactionId = transaction.id;
  const status = transaction.status;
  const amount = transaction.amount?.amount;
  const sourceWalletId = transaction.source?.id;
  const destinationWalletId = transaction.destination?.id;
  
  console.log(`📨 Webhook nhận được: Transaction ${transactionId} status: ${status}`);
  
  if (status === 'CONFIRMED') {
    console.log(`💰 ✅ THANH TOÁN THÀNH CÔNG! ${amount} USDC từ ví ${sourceWalletId} đến ví shop ${destinationWalletId}`);
    
    // Lưu vào file lịch sử
    const confirmedTx = {
      id: transactionId,
      amount: amount,
      status: status,
      sourceWalletId: sourceWalletId,
      timestamp: new Date().toISOString()
    };
    
    let history = [];
    if (fs.existsSync('confirmed-transactions.json')) {
      history = JSON.parse(fs.readFileSync('confirmed-transactions.json', 'utf8'));
    }
    history.push(confirmedTx);
    fs.writeFileSync('confirmed-transactions.json', JSON.stringify(history, null, 2));
    
    console.log(`💾 Đã lưu transaction vào confirmed-transactions.json`);
  }
}

function handleTransactionFailure(event) {
  const transaction = event.data?.transaction;
  if (!transaction) return;
  console.log(`❌ Transaction thất bại: ${transaction.id} - ${transaction.errorCode || 'Unknown error'}`);
}

// Endpoint nhận webhook từ Circle
app.post('/webhook', express.json(), (req, res) => {
  // Trả về ngay lập tức để Circle biết đã nhận
  res.sendStatus(200);
  
  // Xử lý bất đồng bộ
  const event = req.body;
  console.log('🔔 Nhận được webhook event:', event.type);
  
  switch (event.type) {
    case 'transaction.updated':
    case 'transaction.confirmed':
      handleTransactionUpdate(event);
      break;
    case 'transaction.failed':
      handleTransactionFailure(event);
      break;
    default:
      console.log(`⚠️ Unknown event type: ${event.type}`);
  }
});

// ========== KHỞI ĐỘNG SERVER ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 DApp Payment running at http://localhost:${PORT}`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
});