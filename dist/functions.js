"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOrder = exports.getAllCompleteOrders = exports.getAllPendingOrders = exports.deleteSupplier = exports.updateSupplier = exports.addSupplier = exports.getAllSuppliers = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getAllProducts = void 0;
const databaseConnection_1 = __importDefault(require("./databaseConnection")); // Import your PostgreSQL pool connection
// 🟢 Get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield databaseConnection_1.default.query('SELECT products.id, products.name, supplier_id, stock_quantity, ' +
            'item_cost, low_stock_threshold, created_at, updated_at, supplier_name, contact FROM products INNER JOIN ' +
            'suppliers ON supplier_id = suppliers.id ORDER BY products.id');
        res.status(200).json({ message: 'Products retrieved successfully', data: result.rows });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to fetch products.', error });
    }
});
exports.getAllProducts = getAllProducts;
// 🔵 Add a new product
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity } = req.body;
    try {
        const result = yield databaseConnection_1.default.query(`INSERT INTO products (name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity]);
        res.status(201).json({
            message: "Product added successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to add product.', error });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity } = req.body;
    try {
        const result = yield databaseConnection_1.default.query('UPDATE products SET name = $1, supplier_id = $2, category = $3, item_cost = $4, low_stock_threshold = $5, stock_quantity = $6 ' +
            'WHERE id = $7 RETURNING *', [name, supplier_id, category, item_cost, low_stock_threshold, stock_quantity, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to update product.', error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield databaseConnection_1.default.query(`DELETE
             FROM products
             WHERE id = $1 RETURNING *`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(202).json({
            message: "Product deleted successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to delete product.', error });
    }
});
exports.deleteProduct = deleteProduct;
const getAllSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield databaseConnection_1.default.query(`SELECT * FROM suppliers ORDER BY suppliers.id`);
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to get suppliers.', error });
    }
});
exports.getAllSuppliers = getAllSuppliers;
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { supplier_name, contact } = req.body;
    try {
        const result = yield databaseConnection_1.default.query('INSERT INTO suppliers (supplier_name, contact) VALUES ($1, $2) RETURNING *', [supplier_name, contact !== null && contact !== void 0 ? contact : null]);
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to add suppliers.', error });
    }
});
exports.addSupplier = addSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { supplier_name, contact } = req.body;
    try {
        const result = yield databaseConnection_1.default.query('UPDATE suppliers SET supplier_name = $1, contact = $2 WHERE id = $3 RETURNING *', [supplier_name, contact !== null && contact !== void 0 ? contact : null, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: 'Successfully retrieved suppliers.',
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to update suppliers.', error });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield databaseConnection_1.default.query('DELETE FROM suppliers WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: 'Successfully deleted from suppliers.',
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to delete suppliers.', error });
    }
});
exports.deleteSupplier = deleteSupplier;
const getAllPendingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield databaseConnection_1.default.query('SELECT orders.id, order_date, product_id, quantity_ordered, received, orders.created_at, orders.updated_at, name supplier_id, category, stock_quantity, item_cost, low_stock_threshold FROM orders INNER JOIN products ON products.id = product_id WHERE received = FALSE');
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No pending orders found" });
        }
        res.status(200).json({
            message: 'Successfully retrieved all orders.',
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to get all pending orders.', error });
    }
});
exports.getAllPendingOrders = getAllPendingOrders;
const getAllCompleteOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield databaseConnection_1.default.query('SELECT * FROM orders INNER JOIN products ON products.id = product_id WHERE received = TRUE');
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No completed orders" });
        }
        res.status(200).json({
            message: 'Successfully retrieved all completed orders.',
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Unable to get all completed orders.', error });
    }
});
exports.getAllCompleteOrders = getAllCompleteOrders;
const completeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield databaseConnection_1.default.query('BEGIN'); //This starts the transaction
        const orderResult = yield databaseConnection_1.default.query('SELECT orders.id, product_id, quantity_ordered FROM orders WHERE id = $1 AND received = FALSE', [id]);
        if (orderResult.rowCount === 0) {
            yield databaseConnection_1.default.query('ROLLBACK'); //Rollback if order not found
            return res.status(404).json({
                message: 'Order not found or already completed'
            });
        }
        const { product_id, quantity_ordered } = orderResult.rows[0];
        //Update the orders table to mark the order as received
        const updateOrderResult = yield databaseConnection_1.default.query('UPDATE orders SET received = TRUE WHERE id = $1 RETURNING *', [id]);
        const updateStockResult = yield databaseConnection_1.default.query('UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING *', [quantity_ordered, product_id]);
        yield databaseConnection_1.default.query('COMMIT');
        return res.status(200).json({
            message: 'Successfully completed order. Stock updated.',
            order: updateOrderResult.rows[0],
            updated: updateStockResult.rows[0],
        });
    }
    catch (error) {
        yield databaseConnection_1.default.query('ROLLBACK'); //Rollback transaction on error
        console.error("Database error:", error);
        return res.status(500).json({
            message: 'Unable to update order. Stock not updated.', error
        });
    }
});
exports.completeOrder = completeOrder;
