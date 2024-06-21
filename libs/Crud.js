const { Pool } = require("pg");
class Crud {
    constructor(userName, password) {
        this.DATA_TABLE = ["departments", "roles", "employees"];
        this.VIEW_SQL_COMMANDS = ["SELECT * FROM departments",
            "SELECT r.id, r.title, r.salary, d.name AS department FROM roles r JOIN departments d ON r.department = d.id",
            "SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS department, COALESCE(m.first_name || ' ' || m.last_name, 'NULL') AS manager FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department = d.id LEFT JOIN employees m ON e.manager_id = m.id"];
        this.QUERY_PARAMETERS = [{ columnNames: "(name)", parameter: "($1)" },
        { columnNames: "(title, salary, department)", parameter: "($1, $2, $3)" },
        { columnNames: "(first_name, last_name, role_id, manager_id)", parameter: "($1, $2, $3, $4)" }];
        this.pool = new Pool({
            user: `${userName}`,
            password: `${password}`,
            host: "localhost",
            database: "employee_db"
        });
        this.pool.connect();
        this.data = [];
    }

    async setData(tableId) {
        const { rows } = await this.pool.query(this.VIEW_SQL_COMMANDS[tableId]);
        this.data = rows;
    }

    async addData(tableId, values) {
        console.log(values);
        const { rows } = await this.pool.query(`INSERT INTO ${this.DATA_TABLE[tableId]} ${this.QUERY_PARAMETERS[tableId].columnNames} VALUES ${this.QUERY_PARAMETERS[tableId].parameter} RETURNING *`, values);
        return rows[0];
    }

    getData() {
        // console.log(this.data);
        return this.data;
    }

    getDepartmentList = async () => {
        const list = [];
        const { rows } = await this.pool.query("SELECT departments.name FROM departments");
        for (let departmentName of rows) {
            list.push(departmentName.name);
        }
        return list;
    }

    getRoleList = async () => {
        const list = [];
        const {rows} = await this.pool.query("SELECT roles.title FROM roles");
        for(let role of rows){
            list.push(role.title);
        }

        return list;
    }

    getEmployeeList = async () => {
        const list = ["None"];
        const { rows } = await this.pool.query(`SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`);
        for(let manager of rows){
            list.push(manager.name);
        }

        return list;
    }

    async updateEmployeeRole (values){
        try{
            const res = await this.pool.query(`UPDATE employees SET role_id = $1 WHERE id = $2`, values);
            console.log(res);
        }catch (error) {
            console.log(`Updating employee role occurs ERROR\n`, error);
        }
    }
}

module.exports = Crud;