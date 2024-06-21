/** npm packages **/
const inquirer = require("inquirer");
const colors = require("colors");
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

const getNewData = async (id) => {
    let newData = [];
    if (id == 0) newData = await newDepartmentPrompt();
    else if (id == 1) newData = await newRolePrompt();
    else newData = await newEmployeePrompt();
    return newData;
}

const newDepartmentPrompt = async () => {
    console.log(sections[4]);
    const res = await inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of a new department?"
        }
    ]);
    // console.log(res.departmentName);
    return [res.departmentName];
}

const newRolePrompt = async () => {
    const departmentList = await crud.getDepartmentList();
    console.log(sections[5]);
    const res = await inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "Enter role title: "
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Enter salary amount: $",
            validate: async (input) => {
                if (isNaN(parseFloat(input))) {
                    console.log(`\n${colors.red(input)} is INVALID. Enter digit only`);
                    return false;
                }
                return true;
            }
        },
        {
            type: "list",
            name: "roleDepartment",
            choices: departmentList,
            message: "Select department: "
        }
    ]);

    return [res.roleTitle, parseFloat(res.roleSalary), (departmentList.indexOf(res.roleDepartment) + 1)];
}

const newEmployeePrompt = async () => {
    const roleList = await crud.getRoleList();
    const managerList = await crud.getEmployeeList();
    console.log(sections[6]);
    const nameValidation = async (name) => {
        if (name.length > 30) {
            console.log(`${colors.red(name)} has more than 30 characters`);
            return false;
        }
        return true;
    }
    const res = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is his/her first name?",
            validate: nameValidation
        },
        {
            type: "input",
            name: "lastName",
            message: "What is his/her last name?",
            validate: nameValidation
        },
        {
            type: "list",
            name: "roleTitle",
            choices: roleList,
            message: "Select role title:"
        },
        {
            type: "list",
            name: "managerName",
            choices: managerList,
            message: "Select manager name: "
        }
    ]);
    const managerID = res.managerName !== "None" ? managerList.indexOf(res.managerName) + 1 : null;
    console.log([`'${res.firstName}'`, `'${res.lastName}'`, roleList.indexOf(res.roleTitle) + 1, managerID]);
    return [res.firstName, res.lastName, roleList.indexOf(res.roleTitle) + 1, managerID];
}

const updateEmployeeRole = async (id) => {
    const employeeList = await crud.getEmployeeList();
    employeeList.shift();
    const roleList = await crud.getRoleList();
    const res = await inquirer.prompt([
        {
            type: "list",
            name: "employeeName",
            choices: employeeList,
            message: "Select an employee that you want to update:"
        },
        {
            type: "list",
            name: "newRole",
            choices: roleList,
            message: "Select a new role for this employee:"
        }
    ]);

    return [[res.employeeName, res.newRole], [roleList.indexOf(res.newRole) + 1, employeeList.indexOf(res.employeeName) + 1]];
}

const driver = async () => {
    try {
        let isRunning = true;
        // console.log(`${newData} line 60`);
        while (isRunning) {
            await prompt();
            const dataService = menu.getDataService();
            if (dataService.modifyData) {
                // invoke modify data function
                const updateData = await updateEmployeeRole(dataService.id);
                await crud.updateEmployeeRole(updateData[1]);
                menu.resetDataService();
                console.log();
            } else if (dataService.addNewData) {
                // invoke add new data funtion
                const newData = await getNewData(dataService.id);
                const message = await crud.addData(dataService.id, newData);
                menu.resetDataService();
                console.log(message);
            } else if (dataService.id != -1) {
                await crud.setData(dataService.id);
                const data = crud.getData();
                displayData(sections[dataService.id + 1], data);
            }
            else isRunning = false;
        }
    } catch (error) {
        console.log(`${colors.red("ERROR occurs")}\n`, error);
    }
    console.log(`${colors.green("\nThank you for using our application")}`);
    process.exit(0);
}

const displayData = (section, data) => {
    console.log(section);
    console.table(data);
    console.log("\n\n");
}

driver();