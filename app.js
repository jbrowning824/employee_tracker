const inquirer = require('inquirer');
const Database = require('./db');

// database connection info
const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'bromero630', 
    database: 'employee_tracker'
};

// instantiate new database connection
const db = new Database(dbConfig);

// entry point
async function init () {

    await promptMainMenu();    
}

// main menu of employee tracker
async function promptMainMenu() {
    try {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit'
                ],
            },
        ]);

        // switch case to handle user selection
        switch (action) {
            case 'View all departments':
                await db.viewDepartments();
                break;
            case 'View all roles':
                await db.viewRoles();
                break;
            case 'View all employees':
                await db.viewEmployees();
                break;
            case 'Add a department':
                await promptAddDepartment();
                break;
            case 'Add a role':
                break;
            case 'Add an employee':
                break;
            case 'Update an employee role':
                break;
            case 'Exit':
            console.log('Closing Application...');
            return;
        }
        
        // run the main menu again until exit
        promptMainMenu();
    }
    catch(err) {
        console.error('Error during main menu prompt:', err);
    }
}

// prompt for adding new departments
async function promptAddDepartment() {
    const { departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:',
        },
    ]);

    await db.addDepartment(departmentName);
}

async function promptAddRole() {

}

async function promptAddEmployee() {

}

async function promptUpdateEmployee() {

}

// intitialize the app
init();