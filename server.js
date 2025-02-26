import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './Routers/product.js';
import orderRouter from './Routers/order.js';
import userRouter from './Routers/user.js'

dotenv.config();
const app = express();

// חיבור למסד נתונים של MongoDB
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
