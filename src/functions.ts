import {Request, Response} from "express";
import pool from "./databaseConnection"; // Import your PostgreSQL pool connection

// 🟢 Get all products
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT products.id, products.name, supplier_id, stock_quantity, ' +
            'item_cost, low_stock_threshold, created_at, updated_at, supplier_name, contact FROM products INNER JOIN ' +
            'suppliers ON supplier_id = suppliers.id ORDER BY products.id');
        res.status(200).json({message: 'Products retrieved successfully', data: result.rows});
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to fetch products.', error});
    }
};

// 🔵 Add a new product
const addProduct = async (req: Request, res: Response) => {
    const {name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity} = req.body;

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
        res.status(500).json({message: 'Unable to add product.', error});
    }
};


const updateProduct = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity} = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, supplier_id = $2, category = $3, item_cost = $4, low_stock_threshold = $5, stock_quantity = $6 ' +
            'WHERE id = $7 RETURNING *',
            [name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to update product.', error});
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const result = await pool.query(
            `DELETE
             FROM products
             WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(202).json({
            message: "Product deleted successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to delete product.', error});
    }
}

const getAllSuppliers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT * FROM suppliers ORDER BY suppliers.id`,
        );
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to get suppliers.', error});
    }
}

const addSupplier = async (req: Request, res: Response) => {
    const { supplier_name, contact } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO suppliers (supplier_name, contact) VALUES ($1, $2) RETURNING *',
            [supplier_name, contact ?? null]
        );
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to add suppliers.', error});
    }
}
const updateSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { supplier_name, contact } = req.body;
    try {
        const result = await pool.query(
            'UPDATE suppliers SET supplier_name = $1, contact = $2 WHERE id = $3 RETURNING *',
            [supplier_name, contact ?? null, id]
        );
        if(result.rowCount === 0) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to update suppliers.', error});
    }
}
const deleteSupplier = async (req: Request, res: Response) => {
    const {id} = req.params;

    try{
        const result = await pool.query(
            'DELETE FROM suppliers WHERE id = $1',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({
            message: 'Successfully deleted from suppliers.',
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to delete suppliers.', error});
    }
}

const getAllPendingOrders = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT orders.id, order_date, product_id, quantity_ordered, received, orders.created_at, orders.updated_at, name supplier_id, category, stock_quantity, item_cost, low_stock_threshold FROM orders INNER JOIN products ON products.id = product_id WHERE received = FALSE'
        );
        if(result.rowCount === 0) {
            return res.status(404).json({message: "No pending orders found"});
        }
        res.status(200).json({
            message: 'Successfully retrieved all orders.',
            data: result.rows,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to get all pending orders.', error});
    }
}
const getAllCompleteOrders = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM orders INNER JOIN products ON products.id = product_id WHERE received = TRUE'
        );
        if(result.rowCount === 0) {
            return res.status(404).json({message: "No completed orders"});
        }
        res.status(200).json({
            message: 'Successfully retrieved all completed orders.',
            data: result.rows,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({message: 'Unable to get all completed orders.', error});
    }
}
const completeOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.query('BEGIN'); //This starts the transaction
        const orderResult = await pool.query(
            'SELECT orders.id, product_id, quantity_ordered FROM orders WHERE id = $1 AND received = FALSE',
            [id]
        );

        if (orderResult.rowCount === 0) {
            await pool.query('ROLLBACK'); //Rollback if order not found
            return res.status(404).json({
                message: 'Order not found or already completed'
            });
        }

        const { product_id, quantity_ordered } = orderResult.rows[0];

        //Update the orders table to mark the order as received
        const updateOrderResult = await pool.query(
            'UPDATE orders SET received = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        const updateStockResult = await pool.query(
            'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING *',
            [quantity_ordered, product_id]
        );

        await pool.query('COMMIT');

        return res.status(200).json({
            message: 'Successfully completed order. Stock updated.',
            order: updateOrderResult.rows[0],
            updated: updateStockResult.rows[0],
        });
    } catch (error) {
        await pool.query('ROLLBACK'); //Rollback transaction on error
        console.error("Database error:", error);
        return res.status(500).json({
            message: 'Unable to update order. Stock not updated.', error
        });
    }
}

export {getAllProducts, addProduct, updateProduct, deleteProduct, getAllSuppliers, addSupplier, updateSupplier , deleteSupplier, getAllPendingOrders, getAllCompleteOrders, completeOrder};
