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

const addNewDataPrompt = async (id) => {
    let newData = [];
    if(id == 0) newData = await addNewDepartment();
    else if (id == 1) newData = await addNewRole();
    else nemData = await addNewEmployee();
    return newData;
}

const addNewDepartment = async () => {
    console.log(sections[4]);
    const res = await inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of a new department?"
        }
    ]);
    // console.log(res.departmentName);
    return [`'${res.departmentName}'`];
}

const addNewRole = async () => {
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
                if(isNaN(parseFloat(input))){
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

    return [`'${res.roleTitle}'`, parseFloat(res.roleSalary), (departmentList.indexOf(res.roleDepartment) + 1)];
}

const addNewEmployee = async () => {
    const roleList = await crud.getRoleList();
    const managerList = await crud.getEmployeeList();
    console.log(managerList);
    console.log(sections[6]);
    const nameValidation = async (name) => {
        if(name.length > 30){
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
    return [`'${res.firstName}'`, `'${res.lastName}'`, roleList.indexOf(res.roleTitle) + 1, managerID];
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
            } else if (dataService.addNewData) {
                // invoke add new data funtion
                const newData = await addNewDataPrompt(dataService.id);
                // console.log(`${newData.join()} is added\n\n`);
                menu.resetDataService();
                // const message = await crud.addData(dataService.id, `${newData}`);
                console.log(newData);
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