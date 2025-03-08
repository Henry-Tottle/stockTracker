import { Pool } from 'mysql';
import { Request, Response} from "express";
import {Query} from "promise-mysql";
// importing this as a type to assign to DB
const dbConnection = require("./databaseConnection");

const getAllProducts = async (req: Request, res: Response) => {
    const db: Pool = await dbConnection;
    try {
        const products: Query<object> = await db.query('SELECT * FROM products');
        res.status(200).json({ message: 'Product successfully added', data: products });
    } catch (error) {
        res.status(500).json({ message: 'Unable to connect to the database.', data: [error] });
    }
};

module.exports = { getAllProducts };