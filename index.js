/** npm packages **/
const inquirer = require("inquirer");
const colors = require("colors");
const { Pool } = require("pg");
const Crud = require("./libs/Crud");
const Menu = require("./libs/Menu");

const crud = new Crud("postgres", "P@$$word170195");
const menu = new Menu();
const menuList = menu.getMenuList();
const sections = menu.getSectionList();

const prompt = async () => {
    console.log(sections[0]);
    const res = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            choices: menuList,
            message: "What would you like to do?"
        }
    ]);
    menu.setDataService(res.option);
}

const driver = async () => {
    try {
        let isRunning = true;
        while (isRunning) {
            await prompt();
            const dataService = menu.getDataService();
            if (dataService.modifyData) {
                // invoke modify data function
            } else if (dataService.addNewData) {
                // invoke add new data funtion
            } else if (dataService.id != -1) {
                await crud.setOutputData(dataService.id);
                const outputData = crud.getOutputData();
                displayData(sections[dataService.id + 1], outputData);
            }
            else isRunning = false;
        }
    } catch (error) {
        console.log(`${colors.red("ERROR occurs")}\n`, error);
    }
    console.log(`${colors.green("\nThank you for using our application")}`);
    process.exit(0);
}

const displayData = (section, outputData) => {
    console.log(section);
    console.log(outputData.title);
    console.log(outputData.content);
}

driver();