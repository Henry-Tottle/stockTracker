const mysql = require('promise-mysql');
import { Pool } from 'mysql';
const dbConnection: Pool = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'stockTracker'
});

module.exports = dbConnection;