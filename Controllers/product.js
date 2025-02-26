
import { productModel } from "../Models/product.js";



// Retrieve all products
export async function getAllProduct(req, res) {
    try {
        const product = await productModel.find();
        res.status(200).json(product)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to fetch all products", message: err.message })

    }
}


// Retrieve each product by product code
export async function getProductByCode(req, res) {
    const { _id } = req.params;
    try {
        const product = await productModel.findById(_id);
        if (!product) {
            return res.status(404).json({ title: "product not found by id", message: `No product with such id ${_id}` })
        }
        res.status(200).json(product)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to get product by code", message: err.message })

    }
}



// Add product
export async function addProduct(req, res) {
    const { productName, Description, productCreationDate, imageUrl, price, categories, stock, material, dimensions } = req.body;

    // אם אין תאריך יצור אז הוא מקבל אוטומטי תאריך נוכחי
    const finalProductCreationDate = productCreationDate || Date.now();

    if (!productName || !Description || !price || !categories) {
        return res.status(400).json({
            title: "Missing required fields",
            message: "Product name, description, price, and categories are required"
        });
    }

    const validCategories = ['מטבח', 'רהיטים', 'שולחן ואירוח', 'חדר שינה', 'דקורציה', 'חדר רחצה'];
    const invalidCategories = categories.filter(category => !validCategories.includes(category));

    if (invalidCategories.length > 0) {
        return res.status(400).json({
            title: "Invalid category",
            message: `Invalid categories: ${invalidCategories.join(', ')}`
        });
    }

    try {
        const newProduct = new productModel({
            productName,
            Description,
            productCreationDate: finalProductCreationDate,
            imageUrl,
            price,
            categories,
            stock,
            material,
            dimensions,
        });
        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (err) {
        res.status(400).json({ title: "Failed to add product", message: err.message });
    }
}



// Delete product by ID
export async function deleteProduct(req, res) {
    const { productId } = req.params;
    try {
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ title: "Product not found", message: `No product found with id ${productId}` });
        }
        res.status(200).json({ title: "Product deleted successfully" });
    } catch (err) {
        res.status(400).json({ title: "Failed to delete product", message: err.message });
    }
}


// Update product
export async function updateProduct(req, res) {
    const { _id } = req.params;
    const { productName, Description, productCreationDate, imageUrl, price, categories, stock, material, dimensions, } = req.body;
    if (!productName || !Description || !price || !categories)
        return res.status(400).json({ title: "Missing required fields", message: "Product name, description, price, and categories are required" });

    const validCategories = ['מטבח', 'רהיטים', 'שולחן ואירוח', 'חדר שינה', 'דקורציה', 'חדר רחצה'];
    const isValidCategory = categories.every(category => validCategories.includes(category));

    if (!isValidCategory) {
        return res.status(400).json({ title: "Invalid category", message: "One or more invalid" });
    }

    try {
        const product = await productModel.findById(_id);
        if (!product) {
            return res.status(404).json({ title: "product not found", message: `No product with id ${_id}` });
        }

        if (productName) product.productName = productName;
        if (Description) product.Description = Description;
        if (price) product.price = price;
        if (categories) product.categories = categories;
        if (imageUrl) product.imageUrl = imageUrl;
        if (material) product.material = material;
        if (dimensions) product.dimensions = dimensions;
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ title: "Failed to update product", message: err.message });
    }
}

