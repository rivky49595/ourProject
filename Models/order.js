import mongoose, { Schema, model } from "mongoose";

// סכמה למוצר מוזמן (MinimalProduct)
const minimalProductSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: { type: String, required: true }, // שם המוצר
  price: { type: Number, required: true }, // מחיר ליחידה
  quantity: { type: Number, required: true, min: 1 }, // כמות שהוזמנה
});

const orderSchema = new Schema({
  orderDate: { type: Date, default: Date.now }, // תאריך יצירת ההזמנה
  dueDate: { type: Date, required: true }, // תאריך יעד להזמנה
  shippingAddress: { type: String, required: true }, // כתובת למשלוח
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // מזהה הלקוח המזמין
  products: [minimalProductSchema], // רשימת מוצרים מוזמנים
  isShipped: { type: Boolean, default: false }, // האם ההזמנה יצאה?
  shippingPrice: { type: Number, required: true }, // מחיר משלוח
  totalPrice: { type: Number, required: true }, // מחיר סופי כולל
});

export const orderModel = model("Order", orderSchema);
