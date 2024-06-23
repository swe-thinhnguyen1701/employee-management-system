# Employee Mangement System
The Employee Management System is a command-line interface (CLI) application built with Node.js, PostgreSQL, and Inquirer.js. This application allows users to manage company departments, roles, and employees, providing functionalities to add, delete, update, and view records in the database.

## Table Content
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Structure](#structure)
- [Contributing](#contributing)

## Features
* **Add Department:** Create a new department
* **Add Employee:** Add a new employee to the database.
* **Add Role:** Define a new role and assign it to a department.
* **Delete Department:** Remove a department from the database.
* **Delete Employee:** Remove an employee from the database.
* **Delete Role:** Remove a role from the database.
* **Update Employee Manager:** Change the manager of an employee.
* **Update Employee Role:** Update an employee's role.
* **View All Departments:** Display a list of all departments.
* **View All Employees:** Display a list of all employees along with their roles, salaries, and managers.
* **View All Roles:** Display a list of all roles along with their departments and salaries.
* **View Employees by Department:** View employees categorized by their department.
* **View Employees by Manager:** View employees categorized by their managers.
* **View the Total Utilized Budget of a Department:** Calculate and display the total salary budget of a department.

## Installation
### Prerequisites
* Node.js
* PostgreSQL

### Steps
1. Clone the repository:
    ```
    git clone git@github.com:swe-thinhnguyen1701/employee-management-system.git
    ```
    ```
    cd employee-management-system
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Set up PostgreSQL database:
    
    Run the following command to set up PostgresSQL database
    ```
    psql -U [your-user-name]
    ```
    ```
    \i db/schema.sql
    ```
    ```
    \i db/seeds.sql
    ```
## Usage
Run the application using the following command:
```
npm index
```
### Functionality
When you run the application, you will be prompted with various options:

* **Add Department:** You will be prompted to enter the name of the new department.
* **Add Employee:** You will be prompted to enter the details of the new employee, including their first name, last name, role, and manager.
* **Add Role:** You will be prompted to enter the title, salary, and department of the new role.
* **Delete Department:** You will be prompted to select a department to delete.
* **Delete Employee:** You will be prompted to select an employee to delete.
* **Delete Role:** You will be prompted to select a role to delete.
* **Update Employee Manager:** You will be prompted to select an employee and their new manager.
* **Update Employee Role:** You will be prompted to select an employee and their new role.
* **View All Departments:** The list of all departments will be displayed.
* **View All Employees:** The list of all employees along with their roles, salaries, and managers will be displayed.
* **View All Roles:** The list of all roles along with their departments and salaries will be displayed.
* **View Employees by Department:** You will be prompted to select a department, and the employees in that department will be displayed.
* **View Employees by Manager:** You will be prompted to select a manager, and the employees managed by that manager will be displayed.
* **View the Total Utilized Budget of a Department:** You will be prompted to select a department, and the total salary budget of that department will be displayed.
* **Exit:** Exit the application.

## Structure
* **app.js:** The main entry point of the application, which contains the main driver function.
* **Commands and Functions:** Functions to handle different CRUD operations and queries.
* **Helper Functions:** Utility functions to fetch lists from the database and validate input.

## Contributing
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add new feature').
5. Push to the branch (git push origin feature-branch).
6. Open a pull request.