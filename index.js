/** npm packages **/
const inquirer = require("inquirer");
const colors = require("colors");
const { Pool } = require("pg");
const Crud = require("./libs/Crud");
const Menu = require("./libs/Menu");

const crud = new Crud("postgres", "P@$$word170195");
const menu = new Menu();

/** DATA FIELD **/
const TITILES = [
    `,-----------------------------------------------.\n|                ${colors.yellow("Employee Manager")}               |\n\`-----------------------------------------------'`,
    `\n,-----------------------------------------------.\n|                ${colors.yellow("Department Data Base")}               |\n\`-----------------------------------------------'`
]
// change user name and password by prompting user.
// const pool = new Pool({
//     user: "postgres",
//     password: "P@$$word170195",
//     host: "localhost",
//     database: "employee_db"
// });
// pool.connect();

const getOption = async () => {
    console.log(TITILES[0]);
    const res = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            choices: menu.getMenu(),
            message: "What would you like to do?"
        }
    ]);
    menu.setDataService(res.option);
}

//     const id = getOptionHelper(res.option);
//     return id;
// }

// const getOptionHelper = (option) => {
//     for(let i = 0; i < MENU.length; i++){
//         if(option == MENU[i]) return i;
//     }

//     return -1;
// }

// rows: [ {id: #, name: " "}, { ... }, ..., { ... }];
// const viewData = async (tableName) => {
//     const data = await pool.query(`select * from ${tableName}`, (error, {rows}) => {
//         console.log(`first element: ${rows[0].name}`);
//         return rows;
//     });
//     return data;
// }

// const render = (data, tableName) => {

// }

const driver = async () => {
    try {
        let isRunning = true;
        while (isRunning) {
            await getOption();
            const dataService = menu.getDataService();
            if (dataService.modifyData) {
                // invoke modify data function
            } else if (dataService.addNewData) {
                // invoke add new data funtion
            } else if (dataService.id != -1) {
                await crud.setOutputData(dataService.id);
                const outputData = crud.getOutputData();
                displayData(outputData);
            }
            // const data = await getData("departments")
            // console.log(data);
            else isRunning = false;
        }
    } catch (error) {
        console.log(`${colors.red("ERROR occurs")}\n`, error);
    }
    console.log(`${colors.green("\nThank you for using our application")}`);
}

const displayData = (outputData) => {
    console.log(outputData.title);
    console.log(outputData.content);
}

driver();