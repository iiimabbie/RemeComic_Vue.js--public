const mysql = require('mysql');
require('dotenv').config();

const dbConfig = {
    host: process.env.HOST,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    user: process.env.USER,
    database: process.env.DATABASE,
    raise_on_warnings: process.env.RAISE_ON_WARNINGS
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
});

