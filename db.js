//used to separate the database logic from the main app.
const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config).promise();
    }

    //create a view of departments display as table
    async viewDepartments() {
        const query = `SELECT * FROM department`;
        const [rows] = await this.connection.query(query);
        console.table(rows);
    }

    //create a view of roles display as table
    async viewRoles() {
        const query = `
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            INNER JOIN department ON role.department_id = department.id`;
        const [rows] = await this.connection.query(query);
        console.table(rows);
    }

    //create a view of employees display as table
    async viewEmployees() {
        const query = `
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id`;
        const [rows] = await this.connection.query(query);
        console.table(rows);
    }

    async addDepartment(name) {
        const query = `INSERT INTO department (name) VALUES (?)`;
        await this.connection.query(query, name);
        console.log(`Added ${name} to the database`);
    }

    async deleteDepartment(name) {
        try {
            const query = `DELETE FROM department WHERE name = ?`;
            await this.connection.query(query, [name]);
            console.log(`Deleted department with ID ${name}`);
        } catch (err) {
            console.error(`Error deleting department: ${err.message}`);
        }
    }

}


module.exports = Database;