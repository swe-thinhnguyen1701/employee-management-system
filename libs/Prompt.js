const colors = require("colors");
const inquirer = require("inquirer");
const Menu = require("./Menu");
const Crud = require("./Crud");

class Prompt {
    constructor() {
        this.menu = new Menu();
        this.crud = new Crud("postgres", "P@$$word170195");
    }

    async mainMenuPrompt() {
        console.log(this.menu.SECTIONS[0]);
        const res = await inquirer.prompt([{
            type: "list",
            name: "option",
            choices: this.menu.MENU,
            message: "What would you like to do?"
        }]);
        // console.log("STOP");
        this.menu.setDataService(res.option);
        return this.menu.getDataService();
    }

    async addNewDataPrompt(id) {
        if(id == 0) return await this.newDepartmentPrompt();
        if(id == 1) return await this.newRolePrompt();
        return await this.newEmployeePrompt();
    }

    async newDepartmentPrompt() {
        console.log(this.menu.SECTIONS[4]);
        const res = await inquirer.prompt([{
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
            validate: this.validateInputLength(input)
        }]);
        return [res.departmentName];
    }

    async newRolePrompt() {
        const departmentList = await this.crud.getDepartmentList();
        console.log(this.menu.SECTIONS[5]);
        const res = await inquirer.prompt([{
            type: "input",
            name: "roleTitle",
            message: "Enter role title: ",
            validate: this.validateInputLength(input)
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Enter salary amount: $",
            validate: this.validateInputNumber(input)
        },
        {
            type: "list",
            name: "roleDepartment",
            message: "Select department: ",
            choices: departmentList
        }]);
        return [res.roleTitle, res.roleSalary, res.roleDepartment];
    }

    async newEmployeePrompt() {
        const roleList = await this.crud.getRoleList();
        const managerList = await this.crud.getEmployeeList();
        console.log(this.menu.SECTIONS[6]);
        const res = await inquirer.prompt([{
            type: "input",
            name: "employeeFirstName",
            message: "Enter employee's first name: ",
            validate: this.validateInputLength(input)
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "Enter employee's last name: ",
            validate: this.validateInputLength(input)
        },
        {
            type: "list",
            name: "employeeRole",
            message: "Select employee's role: ",
            choices: roleList
        },
        {
            type: "list",
            name: "employeeManager",
            message: "Select employee's manager: ",
            choices: managerList
        }]);
        return [res.employeeFirstName, res.employeeLastName, res.employeeRole, res.employeeManager];
    }

    async validateInputLength (input) {
        if(input.length > 30) {
            console.log(`\n${colors.red(input)} has more than 30 characters`);
            return false;
        }
        return true;
    }

    async validateInputNumber (input) {
        if(isNaN(input)) {
            console.log(`\n${colors.red(input)} is not a number`);
            return false;
        }
        return true;
    }
}

module.exports = Prompt;