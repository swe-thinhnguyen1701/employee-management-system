const colors = require("colors");

class Menu {
  constructor() {
    this.MENU = [
      "Add Deperatment",
      "Add Employee",
      "Add Role",
      "Delete Department",
      "Delete Employee",
      "Delete Role",
      "Update Employee Manager",
      "Update Employee Role",
      "View All Departments",
      "View All Employees",
      "View All Roles",
      "View Employee by Department",
      "View Employee by Manager",
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
      deleteData: false,
      updateData: false,
    };
  }

  setDataService(option) {
    const idx = this.MENU.indexOf(option);
    if (idx < 3) {
      this.dataService.addNewData = true;
      this.dataService.id = idx;
    } else if (idx < 6) {
      this.dataService.deleteData = true;
      this.dataService.id = idx - 3;
    } else if (idx < 8) {
      this.dataService.updateData = true;
      this.dataService.id = idx - 6;
    } else if (idx < 14) {
      this.dataService.id = idx - 8;
    } else {
      this.dataService.id = -1;
    }
  }

  getDataService() {
    return this.dataService;
  }

  resetDataService() {
    this.dataService.id = 0;
    this.dataService.addNewData = false;
    this.dataService.deleteData = false;
    this.dataService.updateData = false;
  }
}

module.exports = Menu;
