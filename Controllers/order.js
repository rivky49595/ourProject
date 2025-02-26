
import { orderModel } from "../Models/order.js";
import { userModel } from "../Models/user.js";
import { productModel } from "../Models/product.js";


// Retrieve all orders
export async function getAllorders(req, res) {
    try {
        const orders = await orderModel.find().populate("customerId").populate("products.productId");
        res.status(200).json(orders)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to fetch all orders", message: err.message })
    }
}


//Add order
export async function addOrder(req, res) {
    const { dueDate, shippingAddress, customerId, products, shippingPrice, totalPrice } = req.body;

    if (!dueDate || !shippingAddress || !customerId || !products || !shippingPrice || !totalPrice) {
        return res.status(400).json({ title: "Missing required fields", message: "All fields are required." });
    }

    if (products.some(product => product.quantity < 1)) {
        return res.status(400).json({ title: "Invalid product quantity", message: "Product quantity must be greater than 0." });
    }

    if (shippingPrice <= 0 || totalPrice <= 0) {
        return res.status(400).json({ title: "Invalid price", message: "Shipping and total price must be greater than 0." });
    }

    try {
        const userExists = await userModel.findById(customerId);
        if (!userExists) {
            return res.status(400).json({ title: "User not found", message: "Invalid customer ID." });
        }

        const productIds = products.map(p => p.productId);
        const existingProducts = await productModel.find({ _id: { $in: productIds } });
        if (existingProducts.length !== products.length) {
            return res.status(400).json({ title: "Invalid products", message: "One or more products do not exist." });
        }
        const newOrder = new orderModel({
            dueDate,
            shippingAddress,
            customerId,
            products,
            shippingPrice,
            totalPrice,
        });

        await newOrder.save();
        res.status(201).json({ message: "order created successfully", order: newOrder });
    } catch (err) {
        res.status(400).json({ title: "Failed to create order", message: err.message })
    }
}


// Delete order
export async function deleteOrder(req, res) {
    const { orderId } = req.params;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ title: "Order not found", message: `No order found with id ${orderId}` });
        }
        if (order.isShipped) {
            return res.status(400).json({ title: "Cannot delete dispatched order", message: "The order has already been dispatched and cannot be deleted." });
        }

        await order.deleteOne();
        res.status(200).json({ title: "Order deleted successfully" });
    } catch (err) {
        res.status(400).json({ title: "Failed to delete order", message: err.message });
    }
}


// Retrieve all orders of a specific user
export async function getOrdersByUser(req, res) {
    const { customerId } = req.params;
    try {
        const userExists = await userModel.findById(customerId)
        if (!userExists) {
            return res.status(404).json({ title: "User not found", message: `No user found with ID ${customerId}` });
        }
        const orders = await orderModel.find({ customerId }).populate("products.productId");
        if (orders.length === 0) {
            return res.status(404).json({ title: "No orders found", message: `No orders found for user with ID ${customerId}` });
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ title: "Failed to fetch orders", message: err.message });
    }
}


// Update a placed order (that has been dispatched). Receives order code and updates the Dispatch field 
export async function updateOrderDispatch(req, res) {
    const { orderId } = req.params;
    try {
        const order = await orderModel.findById({ orderId });
        if (!order) {
            return res.status(404).json({ title: "Order not found", message: `No order found with ID ${orderId}` });
        }
        if (order.isShipped) {
            return res.status(400).json({ title: "Order already dispatched", message: "This order has already been dispatched." });
        }

        order.isShipped = true;
        await order.save();

        res.status(200).json({ message: "Order dispatched successfully.", order });
    } catch (err) {
        res.status(400).json({ title: "Failed to update order", message: err.message });
    }
}