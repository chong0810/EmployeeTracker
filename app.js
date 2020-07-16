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

function createDep() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function (err) {
          if (err) throw err;

          questions();
        }
      );
    });
}

function createRole() {
  connection.query(
    "SELECT department.name, department.id FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              var choiceArrayID = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
                choiceArrayID.push(res[i].id);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
          {
            name: "title",
            type: "input",
            message: "What is the role name?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary?",
          },
        ])
        .then(function (answer) {
          var department_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].name === answer.choice) {
              department_id = res[i].id;
              console.log(department_id);
            }
          }

          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: department_id,
            },
            function (err) {
              if (err) throw err;

              questions();
            }
          );
        });
    }
  );
}

function addEmployee() {
  connection.query(
    "SELECT role.title, role.id FROM employee_trackerDB.role",
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

          var role_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.choice) {
              role_id = res[i].id;
              console.log(role_id);
            }
          }

          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: role_id,
            },
            function (err) {
              if (err) throw err;

              questions();
            }
          );
        });
    }
  );
}


function updateEmployee() {

connection.query(
    `SELECT employee.first_name, employee.last_name, employee.id, role.title, role.id
    FROM employee_trackerDB.employee JOIN employee_trackerDB.role`,

    function(err,res) {
        if (err) throw err;
         console.log(res);
        inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            choices: function () {
              var choiceArray1 = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray1.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray1;
            },
            message: "Which employee do you want to change?",
          },

          {
            name: "roleChoice",
            type: "list",
            choices: function () {
              var choiceArray2 = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray2.push(res[i].title);
              }
              return choiceArray2;
            },
            message: "Which Role do you want to apply to the employee?",
          }
        ]).then(function(answer) {


            var role_id, employeeId;

            for (var i = 0; i < res.length; i++) {
                if (res[i].title === answer.choice) {
                  role_id = res[i].id;
                  console.log(role_id);
                } 
            }

            for (var i = 0; i < res.length; i++) {
                if (`${res[i].first_name} ${res[i].last_name}` === answer.choiceArray1) {
                  employeeId = res[i].id;
                  console.log(employeeId);
                } 
            }


            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: role_id
                    },

                    {
                        id: id
                    },
                ],
                function (err) {
                  if (err) throw err;
    
                  questions();
                }
              );
        });
    }
);

}