const { Pool } = require("pg");
class Crud {
    constructor(userName, password) {
        this.DATA_TABLE = ["departments", "roles", "employees"];
        this.TABLE_TITLE = ["ID      Department\n--      ---------"];
        this.SQL_COMMANDS = ["SELECT * FROM departments"];
        this.pool = new Pool({
            user: `${userName}`,
            password: `${password}`,
            host: "localhost",
            database: "employee_db"
        });
        this.outputData = {
            title: "",
            content: ""
        }
        this.pool.connect();
    }

    async setOutputData (tableId) {
        this.outputData.title = this.TABLE_TITLE[tableId];
        const { rows } = await this.pool.query(`${this.SQL_COMMANDS[tableId]}`);
        // console.log(`FETCHING DATA: ${data}`);
        if (tableId == 0) {
            this.outputData.content = this.setContent(rows);
        }
    }

    setContent (data) {
        let tableContent = "";
        for (let obj of data) {
            tableContent += `${obj.id}        ${obj.name}\n`;
        }

        return tableContent;
    }

    getOutputData () {
        return this.outputData;
    }
}

module.exports = Crud;