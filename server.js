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

//prompt selections
const viewEmployees = () => {
    db.query(
        'SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id ORDER by employee.id',
        (err, res) => {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "addFirstName",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "addLastName",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "roleList",
            message: "What is the employee's role?",
            choices: department
        },
        {
            type: "list",
            name: "managerList",
            message: "Who is the employee's manager?",
            choices: department
        },


    ])
    .then((response) => {
        db.query('INSERT INTO department (name) VALUES (?)', response.deptName, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`Added ${response.addFirstName} ${response.addLastName} to the database`)
        init();
        }
      )}
    ) 
}

const updateRole = () => {
    inquirer.prompt([
        {
            type: "List",
            name: "updateEmployee",
            message: "Which employee's role do you want to update?",
        },
        {
            type: "list",
            name: "updateRole",
            message: "Which role do you want to assign the selected employee?",
        }

    ])
    .then((response) => {
        db.query('INSERT INTO department (name) VALUES (?)', response.deptName, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`Updated employee's role`)
        init();
        }
      )}
    )
}

const viewRoles = () => {
    db.query(
        'SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id', 
        
        (err, res) => {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    }) 
}

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "addRole",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "addSalary",
            message: "What is the salary of the role?",
        },
        {
            type: "list",
            name: "deptList",
            message: "Which department does the role belong to?",
            choices: department
        }

    ])
    .then((response) => {
        db.query('INSERT INTO role (title, salary, department) VALUES (?)', response.addRole, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`Added ${response.addRole} to the database`)
        init();
        }
      )}
    )
}

const viewDepartment = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if(err) {
            throw err
        }
    console.table(res);
    init();
    })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What is the name of the department?",
        }
    ])
    .then((response) => {
        db.query('INSERT INTO department (name) VALUES (?)', response.deptName, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`Added ${response.deptName} to the database`)
        init();
        }
      )}
    )
}