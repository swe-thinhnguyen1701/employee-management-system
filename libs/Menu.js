const colors = require("colors");

class Menu {
  constructor() {
    this.MENU = [
      "Add Deperatment",
      "Add Employee",
      "Add Role",
      "Delte Department",
      "Delete Role",
      "Delete Employee",
      "Update Employee Manager",
      "Update Employee Role",
      "View All Departments",
      "View All Employees",
      "View Employee by Department",
      "View Employee by Manager",
      "View All Roles",
      "View The Total Utilized Budge of A Department",
      "Exit",
    ];
    this.SECTIONS = [
      `,-----------------------------------------------.\n|                ${colors.yellow(
        "Employee Manager"
      )}               |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|              ${colors.yellow(
        "Department Data Base"
      )}             |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|              ${colors.yellow(
        "Roles Data Base"
      )}                  |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|              ${colors.yellow(
        "Employees Data Base"
      )}                  |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|              ${colors.yellow(
        "Add New Department"
      )}               |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|                  ${colors.yellow(
        "Add New Role"
      )}                 |\n\`-----------------------------------------------'`,
      `\n,-----------------------------------------------.\n|                  ${colors.yellow(
        "Add New Employee"
      )}                  |\n\`-----------------------------------------------'`,
    ];
    this.dataService = {
      id: 0,
      addNewData: false,
      modifyData: false,
    };
  }

  getMenuList() {
    return this.MENU;
  }

  getSectionList() {
    return this.SECTIONS;
  }

  setDataService(option) {
    const idx = this.MENU.indexOf(option);
    if (idx == 2) this.dataService.modifyData = true;
    if (idx == 1 || idx == 6 || idx == 4) this.dataService.addNewData = true;
    if (idx < 3) this.dataService.id = 2;
    else if (idx < 5) this.dataService.id = 1;
    else if (idx < 7) this.dataService.id = 0;
    else this.dataService.id = -1;
  }

  resetDataService() {
    this.dataService.id = 0;
    this.dataService.addNewData = false;
    this.dataService.modifyData = false;
  }

  getDataService() {
    return this.dataService;
  }
}

module.exports = Menu;
