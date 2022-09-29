//
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

//connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Thistooksol0ng!',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

db.connect(err => {
    if(err) throw err;
    console.log('Welcome!!')
    init();
});

const init = () => {
    inquirer.prompt ([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }    
    ])
    .then((response) => {
        switch(response.selection) {
            case "View All Employees":
              viewEmployees();
              break;
            case "Add Employee":
              addEmployee();
              break;
            case "Update Employee Role":
              updateRole();
              break;
            case "View All Roles":
              viewRoles();
              break;
            case "Add Role":
              addRole();
              break;
            case "View All Departments":
              viewDepartment();
              break;
            case "Add Department":
              addDepartment();
              break;
            case "Quit":
              db.end();
              break;

        }
    })
}