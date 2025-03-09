import { Request, Response } from "express";
import pool from "./databaseConnection"; // Import your PostgreSQL pool connection

// 🟢 Get all products
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM products INNER JOIN suppliers ON supplier_id = suppliers.id');
        res.status(200).json({ message: 'Products retrieved successfully', data: result.rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to fetch products.', error });
    }
};

// 🔵 Add a new product
const addProduct = async (req: Request, res: Response) => {
    const { name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO products (name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity]
        );

        res.status(201).json({
            message: "Product added successfully",
            data: result.rows[0],
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to add product.', error });
    }
};


const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, supplier_id = $2, category = $3, item_cost = $4, low_stock_threshold = $5, stock_quantity = $6 ' +
            'WHERE id = $7 RETURNING *',
            [name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to update product.', error });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(202).json({
            message: "Product deleted successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to delete product.', error });
    }
}
export { getAllProducts, addProduct, updateProduct, deleteProduct };
