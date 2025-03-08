"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('promise-mysql');
const dbConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'stockTracker'
});
module.exports = dbConnection;
