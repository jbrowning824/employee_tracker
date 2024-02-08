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

    // add new department to the database
    async addDepartment(name) {
        const query = `INSERT INTO department (name) VALUES (?)`;
        await this.connection.query(query, name);
    }

    // add new role to a deparment
    async addRole(title, salary, departmentId) {
        const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        await this.connection.query(query, [title, salary, departmentId]);
    }

    // add new employee to role
    async addEmployee(firstName, lastName, roleId, managerId) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        await this.connection.query(query, [firstName, lastName, roleId, managerId]);
    }

    // remove department
    async deleteDepartment(departmentId) {
        try {
            const query = `DELETE FROM department WHERE name = ?`;
            await this.connection.query(query, [departmentId]);
        } catch (err) {
            console.error(`Error deleting department: ${err.message}`);
        }
    }

    // remove role
    async deleteRole(departmentId) {
        try {
            const query = `DELETE FROM role WHERE id = ?`;
            await this.connection.query(query, [departmentId]);
        } catch (err) {
            console.error(`Error deleting role: ${err.message}`);
        }
    }

    //remove employee
    async deleteEmployee(departmentId) {
        try {
            const query = `DELETE FROM employee WHERE id = ?`;
            await this.connection.query(query, [departmentId]);
        } catch (err) {
            console.error(`Error deleting employee: ${err.message}`);
        }
    }

    // get department data for add or deletes
    async getDepartments() {
        const query = `SELECT * FROM department`;
        const [rows] = await this.connection.query(query);
        return rows;
    }

    // get role data for add or deletes
    async getRoles() {
        const query = `SELECT * FROM role`;
        const [rows] = await this.connection.query(query);
        return rows;
    }

    // get employee data for add or deletes
    async getEmployees() {
        const query = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
        const [rows] = await this.connection.query(query);
        return rows;
    }

    // update employee role
    async updateEmployeeRole(employeeId, roleId) {
        const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
        await this.connection.query(query, [roleId, employeeId]);
    }

}


module.exports = Database;