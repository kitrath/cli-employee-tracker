require('dotenv').config();

const mysql = require('mysql2');
const cTable = require('console.table');

const queries = require('./src/query');
const PromptRunner = require('./src/PromptRunner');

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`\n** Connected to the ${process.env.DB_NAME} database. **\n`)
);

const employeeManagementSystem = new PromptRunner(queries, db, console.table);

employeeManagementSystem.init();