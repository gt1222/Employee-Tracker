//import required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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

//if error connected to database
db.connect(err => {
    if(err) throw err;
    console.log('Welcome!!')
    init();
});

//initialize the selection prompt
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

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, res) {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    })
}

const addEmployee = () => {
    
}

const updateRole = () => {
    
}

const viewRoles = () => {
    db.query('SELECT * FROM role', function (err, res) {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    }) 
}

const addRole = () => {
    
}

const viewDepartment = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    })
}

const addDepartment = () => {
    
}