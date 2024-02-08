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
                await promptAddRole();
                break;
            case 'Add an employee':
                await promptAddEmployee();
                break;
            case 'Update an employee role':
                await promptUpdateEmployee();
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
    try {
        const { departmentName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the new department:',
            },
        ]);

        await db.addDepartment(departmentName);
    }
    catch(err) {
        console.error('Error during adding department:', err)
    }
}

// prompt for adding new roles
async function promptAddRole() {
    try {
        const departments = await db.getDepartments();
        const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the new role:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for this role:',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department for this role:',
                choices: departmentChoices,
            },
        ]);

        await db.addRole(answers.title, answers.salary, answers.departmentId);
    }
    catch(err) {
        console.error('Error during adding role:', err)
    }
}

// prompt for adding new employees
async function promptAddEmployee() {
    try {
        const roles = await db.getRoles();
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const employees = await db.getEmployees();
        const managerChoices = employees.map(emp => ({ name: emp.name, value: emp.id }));
        
        // give user ability to select null as a manager
        managerChoices.unshift({ name: 'None', value: null });

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: managerChoices,
            },
        ]);

        // Add new employee
        await db.addEmployee(firstName, lastName, roleId, managerId);
        console.log(`${firstName} ${lastName} added to the database.`);
    }
    catch(err) {
        console.error('Error during adding employee:', err)
    }
}

// prompt for updating employees
async function promptUpdateEmployee() {
    try{
        const roles = await db.getRoles();
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const employees = await db.getEmployees();
        const employeeChoices = employees.map(emp => ({ name: emp.name, value: emp.id }));

        const { employeeId, newRoleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee do you want to update?',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'newRoleId',
                message: "What is the employee's new role?",
                choices: roleChoices,
            },
        ]);

        await db.updateEmployeeRole(employeeId, newRoleId);
        console.log(`Employee's role updated in the database.`);
    }
    catch(err) {
        console.error('Error during updating employee:', err)
    }
}

// intitialize the app
init();