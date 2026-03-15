// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             Int       @id @default(autoincrement())
  email          String    @unique
  passwordHash   String
  firstName      String?
  lastName       String?
  phone          String?
  role           String    @default("customer")
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  addresses      Address[]
  orders         Order[]
  cart           Cart?
}

model Product {
  id             Int       @id @default(autoincrement())
  categoryId     Int?
  name           String
  slug           String    @unique
  priceUsd       Float
  priceRub       Float?
  quantity       Int       @default(0)
  reserved       Int       @default(0)
  description    String?
  isActive       Boolean   @default(true)
  isFeatured     Boolean   @default(false)
  isNew          Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  category       Category? @relation(fields: [categoryId], references: [id])
  variants       ProductVariant[]
  images         ProductImage[]
  cartItems      CartItem[]
  orderItems     OrderItem[]
}

model ProductVariant {
  id             Int       @id @default(autoincrement())
  productId      Int
  sku            String    @unique
  size           String?
  color          String?
  colorCode      String?
  quantity       Int       @default(0)
  priceAdjust    Float     @default(0)
  isActive       Boolean   @default(true)
  
  product        Product   @relation(fields: [productId], references: [id])
}

model Order {
  id                Int       @id @default(autoincrement())
  orderNumber       String    @unique
  userId            Int
  status            String    @default("pending")
  paymentStatus     String    @default("pending")
  shippingStatus    String    @default("pending")
  subtotal          Float
  discountAmount    Float     @default(0)
  shippingAmount    Float     @default(0)
  totalAmount       Float
  trackingNumber    String?
  paymentMethod     String?
  shippingAddressId Int?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  user              User      @relation(fields: [userId], references: [id])
  items             OrderItem[]
  shippingAddress   Address?  @relation(fields: [shippingAddressId], references: [id])
}