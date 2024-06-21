const colors = require("colors");
const inquirer = require("inquirer");
const Menu = require("./Menu");

class Prompt {
    constructor() {
        this.menu = new Menu();
        this.sections = this.menu.SECTIONS;
    }

    async mainMenuPrompt() {
        console.log(this.sections[0]);
        const res = await inquirer.prompt([{
            type: "list",
            name: "option",
            message: "What would you like to do?",
            choices: this.menu.MENU
        }]);

        this.menu.setDataService(res.option);
        return this.menu.getDataService();
    }
}

module.exports = Prompt;