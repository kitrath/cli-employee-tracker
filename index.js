require('dotenv').config();

const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

db.query('SELECT employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS `Role`, role.salary AS `Salary` FROM employee JOIN role ON employee.role_id = role.id', (err, result) => {
    if (err) {
        console.error(err);
    } else {
        console.log(console.table);
        console.table(result);
    }
});

