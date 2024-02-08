//used to separate the database logic from the main app.
const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config).promise();
    }

    async viewDepartments() {
        const query = `SELECT * FROM department`;
        const [rows] = await this.connection.query(query);
        console.table(rows);
    }
}


module.exports = Database;