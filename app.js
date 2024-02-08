const inquirer = require('inquirer');
const Database = require('./db');


const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'bromero630', 
    database: 'employee_tracker'
};

// instantiate new database connection
const db = new Database(dbConfig);

//testing to make sure views work
async function init () {
    await db.viewDepartments();
    await db.viewEmployees();
    await db.viewRoles();
}

init();