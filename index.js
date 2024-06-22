/** npm packages **/
const inquirer = require("inquirer");
const colors = require("colors");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "P@$$word170195",
  host: "localhost",
  database: "employee_db",
});

const options = [
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

const getOption = async () => {
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      choices: options,
      message: "What would you like to do?",
    },
  ]);

  return res.option;
};

/**
 * Prompts the user to input the name of a new department and adds it to the database.
 */
const addDepartment = async () => {
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of a new department?",
      validate: validateInputLength,
    },
  ]);

  const values = [res.departmentName];
  const { rows } = await pool.query(
    "INSERT INTO departments (name) VALUES ($1) RETURNING *",
    values
  );
  console.log(rows[0]);
};

/**
 * Prompts the user to input details for a new employee and adds them to the database.
 */
const addEmployee = async () => {
  const employeeList = await getEmployeeList();
  // console.log(`employee list: ${JSON.stringify(employeeList)}`);
  // const formatEmployeeList = [];
  // for (let employee of employeeList) {
  //   formatEmployeeList.push(`${employee.id}\t${employee.name}`);
  // }
  const roleList = await getRoleList();
  // const formatRoleList = [];
  // for (let role of roleList) {
  //   formatRoleList.push(`${role.id}\t${role.title}`);
  // }
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is the first name of a new employee?",
      validate: validateInputLength,
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is the last name of a new employee?",
      validate: validateInputLength,
    },
    {
      type: "list",
      name: "employeeRole",
      choices: roleList,
      message: `Which is the role of a new employee?\n  ID\tRole Title\n  --\t${"-".repeat(
        10
      )}`,
    },
    {
      type: "list",
      name: "employeeManagerName",
      choices: employeeList,
      message: `Who is manager of a new employee\n  ID\tManager Name\n  --\t${"-".repeat(
        12
      )}`,
    },
  ]);
  const managerId = employeeList.find(
    (employee) => employee.name === res.employeeManagerName
  ).id;
  const roleId = roleList.find((role) => role.title === res.employeeRole).id;
  const values = [
    res.employeeFirstName,
    res.employeeLastName,
    roleId,
    managerId,
  ];

  const { rows } = await pool.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *",
    values
  );
  console.log(rows[0]);
};

/**
 * Prompts the user to input details for a new role and adds it to the database.
 */
const addRole = async () => {
  const departmentList = await getDepartmentList();
  // console.log(`department list: ${JSON.stringify(departmentList)}`);
  // const formatDepartmentList = ["ID\tDepartment Name", `--\t${"-".repeat(15)}`];
  // for (let department of departmentList) {
  //   formatDepartmentList.push(`${department.id}\t${department.name}`);
  // }
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the title of a new role?",
      validate: validateInputLength,
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of a new role?",
      validate: validateInputNumber,
    },
    {
      type: "list",
      name: "roleDepartment",
      choices: departmentList,
      message: "Which department does the role belong to?",
    },
  ]);

  // console.log(`IDX: ${formatDepartmentList.indexOf(res.roleDepartment) - 2}`);
  // console.log(JSON.stringify(departmentList[formatDepartmentList.indexOf(res.roleDepartment) - 2]));
  const departmentId = departmentList.find(
    (department) => department.name === res.roleDepartment
  ).id;
  const values = [res.roleTitle, parseFloat(res.roleSalary), departmentId];
  const { rows } = await pool.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *",
    values
  );
  console.log(rows[0]);
};

const deleteDepartment = async () => {
  const departmentList = await getDepartmentList();
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "departmentName",
      choices: departmentList,
      message: "Which department do you want to delete?",
    },
  ]);
  const departmentId = departmentList.find(
    (department) => department.name === res.departmentName
  ).id;
  const values = [departmentId];
  try {
    const roles = await pool.query(
      "SELECT r.title FROM roles r WHERE department_id = $1",
      values
    );
    // const employees = await pool.query(
    //   "SELECT CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e WHERE role_id IN (SELECT id FROM roles WHERE department_id = $1)",
    //   values
    // );
    console.log("ROLES list: ", roles.rows);
    if (roles.rows.length > 0) {
      console.log(
        `\n${colors.red(
          "Cannot delete a department that contains roles or employees."
        )}\n`
      );
      return;
    }
    await pool.query("DELETE FROM departments WHERE id = $1", values);
    console.log(`${colors.green(res.departmentName)} is removed`);
  } catch (error) {
    console.log(`${colors.red("ERROR occurs while deleting!")}\n${error}`);
  }
};

const deleteEmployee = async () => {
  const employeeList = await getEmployeeList();
  console.log(employeeList);
  employeeList.shift();
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "employeeName",
      choices: employeeList,
      message: "Which employee do you want to delete?",
    },
  ]);

  const employeeId = employeeList.find(
    (employee) => employee.name === res.employeeName
  ).id;
  const values = [employeeId];
  try {
    await pool.query(
      "UPDATE employees SET manager_id = NULL WHERE manager_id = $1",
      values
    );
    await pool.query("DELETE FROM employees WHERE id = $1", values);
    console.log(`${colors.green(res.employeeName)} is removed`);
  } catch (error) {
    console.log(`${colors.red("ERROR occurs while deleting!")}\n${error}`);
  }
};

/**
 * Prompts the user to select an employee and a new role, then updates the employee's role in the database.
 */
const updateEmployeeRole = async () => {
  const employeeList = await getEmployeeList();
  employeeList.shift(); //  remove None option
  const roleList = await getRoleList();
  const res = await inquirer.prompt([
    {
      type: "list",
      name: "employeeName",
      choices: employeeList,
      message: "Which employee's role do you want to update?",
    },
    {
      type: "list",
      name: "employeeNewRole",
      choices: roleList,
      message: "Which is the new role of the employee?",
    },
  ]);

  const roleId = roleList.indexOf(res.employeeNewRole) + 1;
  const values = [roleId, employeeList.indexOf(res.employeeName) + 1];
  const { rows } = await pool.query(
    "UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *",
    values
  );
  console.log(rows[0]);
};

/**
 * Fetches and displays the department table from the database.
 */
const viewDepartmentTable = async () => {
  console.log(
    `\n\n${"=".repeat(20)} ${colors.green("DEPARTMENT TABLE")} ${"=".repeat(
      20
    )}`
  );
  const { rows } = await pool.query("SELECT d.name FROM departments d");
  console.table(rows);
  console.log("\n\n");
};

/**
 * Fetches and displays the employee table from the database.
 */
const viewEmployeeTable = async () => {
  console.log(
    `\n\n${"=".repeat(20)} ${colors.green("EMPLOYEE TABLE")} ${"=".repeat(20)}`
  );
  const { rows } = await pool.query(
    "SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS department, COALESCE(m.first_name || ' ' || m.last_name, 'NULL') AS manager FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id"
  );
  console.table(rows);
  console.log("\n\n");
};

/**
 * Fetches and displays the role table from the database.
 */
const viewRoleTable = async () => {
  console.log(
    `\n\n${"=".repeat(20)} ${colors.green("ROLE TABLE")} ${"=".repeat(20)}`
  );
  const { rows } = await pool.query(
    "SELECT r.id, r.title, r.salary, d.name AS department FROM roles r JOIN departments d ON r.department_id = d.id"
  );
  console.table(rows);
  console.log("\n\n");
};

/**
 * Fetches the list of departments from the database.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of department names.
 */
const getDepartmentList = async () => {
  const { rows } = await pool.query("SELECT * FROM departments");
  return rows;
};

/**
 * Fetches the list of roles from the database.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of role titles.
 */
const getRoleList = async () => {
  const { rows } = await pool.query("SELECT r.id, r.title FROM roles r");

  return rows;
};

/**
 * Fetches the list of employees from the database.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of employee names,
 *                                starting with "None".
 */
const getEmployeeList = async () => {
  const employeeList = [{ id: null, name: "None" }];
  const { rows } = await pool.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e"
  );
  for (let employee of rows) {
    employeeList.push(employee);
  }
  console.log(JSON.stringify(rows));
  return employeeList;
};

/**
 * Validates the length of an input string.
 *
 * @param {string} input - The input string to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the input length is 30 characters or less,
 *                               and `false` if the input length is more than 30 characters.
 */
const validateInputLength = async (input) => {
  if (input.length > 30) {
    console.log(`\n${colors.red(input)} has more than 30 characters`);
    return false;
  }
  return true;
};

/**
 * Validates if the input is a number.
 *
 * @param {string} input - The input string to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the input is a valid number,
 *                               and `false` if the input is not a valid number.
 */
const validateInputNumber = async (input) => {
  if (isNaN(input)) {
    console.log(`\n${colors.red(input)} is not a number`);
    return false;
  }
  return true;
};

const driver = async () => {
  let isRunning = true;
  while (isRunning) {
    const option = await getOption();
    if (option === "Add Deperatment") {
      await addDepartment();
    } else if (option === "Add Employee") {
      await addEmployee();
    } else if (option === "Add Role") {
      await addRole();
    } else if (option === "Delete Department") {
      await deleteDepartment();
    } else if (option === "Delete Employee") {
      await deleteEmployee();
    } else if (option === "Delete Role") {
    } else if (option === "Update Employee Manager") {
    } else if (option === "Update Employee Role") {
      await updateEmployeeRole();
    } else if (option === "View All Departments") {
      await viewDepartmentTable();
    } else if (option === "View All Employees") {
      await viewEmployeeTable();
    } else if (option === "View All Roles") {
      await viewRoleTable();
    } else if (option === "View Employee by Department") {
    } else if (option === "View Employee by Manager") {
    } else if (option === "View The Total Utilized Budge of A Department") {
    } else isRunning = false;
  }
};

driver();
