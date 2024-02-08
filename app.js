const inquirer = require('inquirer');
const Database = require('./db');

const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'bromero630', 
    database: 'employee_tracker'
};

const db = new Database(dbConfig);

//testing to make sure view departments works
async function init () {
await db.viewDepartments();

}

init();