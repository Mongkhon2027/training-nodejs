# Express.js Training Project

โปรเจค REST API สำหรับระบบจัดการสินค้าและคำสั่งซื้อ พัฒนาด้วย Express.js และ MongoDB

## Features

- **User Authentication**: ระบบ Login/Register ด้วย JWT
- **User Approval System**: ระบบอนุมัติผู้ใช้โดย Admin
- **Product Management**: CRUD operations สำหรับจัดการสินค้า
- **Order Management**: สร้างและจัดการคำสั่งซื้อ
- **Stock Management**: จัดการสต็อกสินค้าแบบอัตโนมัติ
- **Order Aggregation**: รวมยอดคำสั่งซื้อแบ่งตามสินค้า

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

## Prerequisites

ติดตั้งโปรแกรมเหล่านี้ก่อนใช้งาน:

- Node.js (แนะนำ v16 ขึ้นไป)
- MongoDB Atlas Account หรือ MongoDB Local
- npm หรือ yarn

## Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd exjs-training
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **ตั้งค่า environment variables**

สร้างไฟล์ `.env` ที่ root directory:
```env
MG_CONNECT=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database
NODE_PORT=3000
JWT_SECRET=your-secret-key-here
```

**คำอธิบาย:**
- `MG_CONNECT`: MongoDB connection string
- `NODE_PORT`: พอร์ตที่ใช้รัน server (default: 3000)
- `JWT_SECRET`: Secret key สำหรับ sign JWT token (แนะนำใช้ random string ยาวๆ)

4. **รัน server**
```bash
npm start
# หรือ
npm run dev
```

Server จะทำงานที่ `http://localhost:3000`

## API Endpoints

### Public Routes

#### Health Check
```
GET /api/v1
```
ตรวจสอบว่า API ทำงาน

#### User Authentication
```
POST /api/v1/users/register
Body: {
  "username": "string",
  "password": "string",
  "role": "user" | "admin"  // optional, default: "user"
}
```

```
POST /api/v1/users/login
Body: {
  "username": "string",
  "password": "string"
}
Response: {
  "token": "jwt-token",
  "approved": boolean
}
```

### Protected Routes (ต้องใส่ JWT Token)

**Header ที่ต้องส่ง:**
```
Authorization: Bearer <your-jwt-token>
```

#### User Management
```
PUT /api/v1/users/:id/approve
อนุมัติผู้ใช้ (Admin only)
```

#### Product Management
```
GET /api/v1/products
ดูสินค้าทั้งหมด

GET /api/v1/products/:id
ดูสินค้าตาม ID

POST /api/v1/products
สร้างสินค้าใหม่
Body: {
  "name": "string",
  "price": number,
  "stock": number
}

PUT /api/v1/products/:id
อัพเดทสินค้า
Body: {
  "name": "string",      // optional
  "price": number,       // optional
  "stock": number        // optional (จะบวกเพิ่มกับค่าเดิม)
}

DELETE /api/v1/products/:id
ลบสินค้า
```

#### Order Management
```
GET /api/v1/products/:id/orders
ดูคำสั่งซื้อรวมของสินค้าหนึ่งชิ้น
Response: {
  "product_id": "string",
  "product_name": "string",
  "quantity": number,     // รวมจำนวนทั้งหมด
  "price": number         // รวมราคาทั้งหมด
}

POST /api/v1/products/:id/orders
สร้างคำสั่งซื้อสำหรับสินค้า
Body: {
  "quantity": number
}

GET /api/v1/orders
ดูคำสั่งซื้อทั้งหมดแบ่งตามสินค้า
Response: [
  {
    "product_id": "string",
    "product_name": "string",
    "quantity": number,
    "price": number
  }
]
```

## Database Models

### User
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  approved: Boolean (default: false)
}
```

### Product
```javascript
{
  name: String,
  price: Number,
  stock: Number
}
```

### Order
```javascript
{
  product_id: ObjectId (ref: Product),
  quantity: Number,
  price: Number  // price * quantity
}
```

## Project Structure

```
exjs-training/
├── config/
│   └── config.js          # การตั้งค่าและ global variables
├── controllers/
│   └── v1/
│       ├── user.js        # User & Auth logic
│       ├── products.js    # Product CRUD logic
│       └── orders.js      # Order management logic
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── user.js            # User schema
│   ├── products.js        # Product schema
│   └── orders.js          # Order schema
├── routes/
│   ├── index.js           # Main router
│   └── v1/
│       ├── index.js       # V1 API router
│       ├── users.js       # User routes
│       ├── products.js    # Product routes
│       └── orders.js      # Order routes
├── .env                   # Environment variables
├── app.js                 # Express app entry point
└── package.json
```

## Authentication Flow

1. **Register**: สร้าง user ใหม่ (approved: false)
2. **Admin Approve**: Admin ต้องอนุมัติผู้ใช้ผ่าน `/users/:id/approve`
3. **Login**: ผู้ใช้ล็อกอินและได้รับ JWT token
4. **Access Protected Routes**: ใช้ token ใน Authorization header

**หมายเหตุ:** ผู้ใช้ที่ยังไม่ได้รับการอนุมัติจะไม่สามารถเข้าถึง protected routes ได้

## Error Handling

API จะ return error ในรูปแบบ:
```json
{
  "status": 400|401|403|404|500,
  "message": "Error description"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials, not approved)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Development

```bash
# รัน server ในโหมด development (auto-reload)
npm run dev

# รัน server แบบปกติ
npm start
```

## Security Features

- Password hashing ด้วย bcrypt
- JWT token authentication
- User approval system
- Protected routes middleware
- Validation ป้องกัน duplicate username/product name
- Stock validation ป้องกันการสั่งซื้อเกินสต็อก

## Notes

- Stock จะถูกหักอัตโนมัติเมื่อมีการสร้าง order
- การ update stock ใน product จะใช้ `$inc` operator เพื่อบวกเพิ่ม
- Order records จะถูกเก็บแยก (ไม่ merge) เพื่อให้ audit trail ที่ดี
- การแสดงผล order จะรวมยอดที่ read-time ด้วย aggregation

## License

ISC
