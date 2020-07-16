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
        "Exit",
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
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
      if (err) throw err;

      console.table(res);
      questions();
    }
  );
}

function viewAllDepartment() {
  connection.query(
    "SELECT department.name FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          console.log(answer.choice);

          connection.query(
            `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
      FROM employee_trackerDB.employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE department.name LIKE "${answer.choice}"`,
            function (err, res) {
              if (err) throw err;

              console.table(res);
              questions();
            }
          );
        });
    }
  );
}

function viewAllRole() {
  connection.query("SELECT role.title FROM employee_trackerDB.role", function (
    err,
    res
  ) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
          message: "Which Role?",
        },
      ])
      .then(function (answer) {
        console.log(answer);
        console.log(answer.choice);

        connection.query(
          `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
        FROM employee_trackerDB.employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE role.title LIKE "${answer.choice}"`,
          function (err, res) {
            if (err) throw err;

            console.table(res);
            questions();
          }
        );
      });
  });
}
