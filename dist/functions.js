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
exports.updateProduct = exports.addProduct = exports.getAllProducts = void 0;
const databaseConnection_1 = __importDefault(require("./databaseConnection")); // Import your PostgreSQL pool connection
// 🟢 Get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield databaseConnection_1.default.query('SELECT * FROM products INNER JOIN suppliers ON supplier_id = suppliers.id');
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
