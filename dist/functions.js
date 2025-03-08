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
Object.defineProperty(exports, "__esModule", { value: true });
// importing this as a type to assign to DB
const dbConnection = require("./databaseConnection");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield dbConnection;
    try {
        const products = yield db.query('SELECT * FROM products');
        res.status(200).json({ message: 'Product successfully added', data: products });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to connect to the database.', data: [error] });
    }
});
module.exports = { getAllProducts };
