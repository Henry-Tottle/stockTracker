"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const cors = require("cors");
const { getAllProducts, addProduct, updateProduct, deleteProduct, getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, getAllPendingOrders, getAllCompleteOrders, completeOrder } = require("./functions.js");
const port = Number(process.env.PORT) || 3008;
app.use(cors());
app.use(express.json());
//products
app.get('/products', getAllProducts);
app.post('/products', addProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);
//suppliers
app.get('/suppliers', getAllSuppliers);
app.post('/suppliers', addSupplier);
app.put('/suppliers/:id', updateSupplier);
app.delete('/suppliers/:id', deleteSupplier);
//orders
app.get('/orders/pending', getAllPendingOrders);
app.get('/orders/complete', getAllCompleteOrders);
app.put('/orders/complete/:id', completeOrder);
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
