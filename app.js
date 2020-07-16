var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;

  questions();
});

function addQuestions() {
  inquirer;
}

function questions() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Choose below.",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Role",
        "Create Department",
        "Create Role",
        "Add Employee",
        "Delete Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit"
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees by Department":
          viewAllDepartment();
          break;

        case "View All Employees by Role":
          viewAllRole();
          break;

        case "Create Department":
          createDep();
          break;
        case "Create Role":
          createRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "Update Employee Manager":
          updateManager();
          break;

        case "Exit":
            break;
      }
    });
}

function viewAll() {
    connection.query(`SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
        if (err) 
        throw err;

        console.table(res);
        questions();
    });
}

function viewAllDepartment() {

    var array = [];

    connection.query('SELECT department.name FROM employee_trackerDB.department',
    function (err, res) {

        if(err) 
        throw err;

        
        console.log(res);


    });



    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What department?",

    }).then(function(answer) {
        connection.query(`SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    WHERE department.name LIKE '${answer.department}`
    ,


    function (err, res) {
        if (err) 
        throw err;

        console.table(res);
        questions();
    });
    });



    
}