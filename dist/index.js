"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const cors = require("cors");
const { getAllProducts } = require("./functions.js");
const port = Number(process.env.PORT) || 3008;
app.use(cors());
app.use(express.json());
app.get('/products', getAllProducts);
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
