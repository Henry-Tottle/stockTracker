import {Express} from "express";

const express = require('express');
const app : Express = express();
const cors = require("cors");
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require("./functions.js");
const port :  number = Number(process.env.PORT) || 3008;
app.use(cors());
app.use(express.json());

app.get('/products', getAllProducts);

app.post('/products', addProduct);

app.put('/products/:id', updateProduct);

app.delete('/products/:id', deleteProduct);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
