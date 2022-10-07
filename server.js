//import required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { arrayBuffer } = require('stream/consumers');

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
    if (err) throw err;
    console.log('Welcome!!')
    init();
});

//initialize the selection prompt
const init = () => {
    inquirer.prompt([
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
            switch (response.selection) {
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
        //should've made queries in a separate file, but prob do that some other time
        'SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id ORDER by employee.id',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
}

const addEmployee = () => {
    db.query('SELECT role.id, role.title FROM role', (err, res) =>{
        if(err) throw(err);
        const roleOptions = res.map((res) => res.title);

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
                choices: roleOptions
            },
        ]).then((response) => {
            const roleChoice = response.roleList;

            db.query('SELECT role.id, role.title FROM role', (err,res) => {
                if(err) throw(err);

                let filterRole = res.filter(res => {
                    return res.title === roleChoice
                })

                let roleID = filterRole[0].id;

                db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee', (err, res) => {
                    if(err) throw (err);
    
                    const managerOptions = res.map((res) => res.manager);
                    managerOptions.unshift('None');

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "managerList",
                            message: "Who is the employee's manager?",
                            choices: managerOptions
                        },
                    ]).then((managerResponse) => {
                        const managerChoice = managerResponse.managerList; 
                        
                        db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee', (err, res) => {
                            if(err) throw (err);

                            let filterManager = res.filter(res => {
                                return res.manager === managerChoice
                                
                            })

                            let managerID;

                            if (managerChoice === 'None') {
                                managerID = null;   
                            }else {
                                managerID = filterManager[0].id;
                            }

                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.addFirstName}", "${response.addLastName}", ${roleID}, ${managerID})`, (err, res) => {
                                if(err) throw (err);

                                console.log(`Added ${response.addFirstName} ${response.addLastName} to the database`);

                                init();
                            })
                        })
                    })
                })
            })
        })
    })
}

const updateRole = () => {
    db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee', (err, res) => {
        if (err) throw (err);
        const employeeList = res.map((res) => res.name)
        console.log(employeeList);

        inquirer.prompt([
            {
                type: "list",
                name: "updateEmployee",
                message: "Which employee's role do you want to update?",
                choices: employeeList
            },
        ]).then((response) => {
            const updateEChoice = response.updateEmployee;

            db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee', (err, res) => {
                if (err) throw (err);

                let filterEChoice = res.filter(res => {
                    return res.name === updateEChoice
                })

                let employeeID = filterEChoice[0].id;

                db.query('SELECT * FROM role', (err, res) => {
                    if (err) throw (err);
                    const roleList = res.map((res) => res.title)
                    console.log(roleList);

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "updateRole",
                            message: "Which role do you want to assign the selected employee?",
                            choices: roleList
                        }
                    ]).then((roleResponse) => {
                        const updateRoleChoice = roleResponse.updateRole;

                        db.query('SELECT * FROM role', (err, res) => {
                            if (err) throw (err);
                            let filterRoleChoice = res.filter(res => {
                                return res.title === updateRoleChoice
                            })

                            let roleID = filterRoleChoice[0].id;

                            db.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                                if (err) throw err;

                                console.log(`Updated employee's role`);

                                init();
                            })
                        }
                        )
                    })
                })
            }
            )
        }
        )
    }
    )
}

const viewRoles = () => {
    db.query(
        'SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id',

        (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
}

const addRole = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const deptOptions = res.map((res) => res.name)

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
            },
            {
                type: "list",
                name: "deptList",
                message: "Which department does the role belong to?",
                choices: deptOptions
            },
        ]).then((response) => {
            const deptChoice = response.deptList;

            db.query('SELECT * FROM department', (err, res) => {
                if (err) throw (err);

                let filterDept = res.filter(res => {
                    return res.name === deptChoice;
                })

                let deptId = filterDept[0].id;

                //adding to the table but why doesnt it show up when viewed; realized in table the results are 0 or null and had to get values as string and numbers correctly
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.title}", ${parseInt(response.salary)}, ${deptId})`, (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${response.title} to the database`);

                    init();
                })
            }
            )
        }
        );
    });
};


const viewDepartment = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
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
                if (err) throw err;
                console.log(`Added ${response.deptName} to the database`);
                init();
            }
            )
        }
        )
}