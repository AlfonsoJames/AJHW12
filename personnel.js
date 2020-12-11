
const inquirer = require("inquirer");
const cTable = require("console.table");
// const seed = require("./seeds")

// var connection = mysql.createConnection({
//   host: "localhost",

//   // Your port; if not 3306
//   port: 3306,

//   // Your username
//   user: "root",

//   // Your password
//   password: "Smashone1!",
//   database: "personnel_db"
// });

// connection.connect(function(err) {
//   if (err) throw err;
//   ui.log.write("connected as id " + connection.threadId + "\n");
// });


const connection = require("./config/connection").connection

//Main Prompt Menu
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Please Select:",
      choices: ["Add Department", "Add Roles", "Add Employees", "View All Employees", "View Roles", "View Departments", "Update an Employee Role", "Exit"]
    })
    .then(function (answer) {

      switch (answer.action) {
        case "Add New Department":
          addDepartment();
          break;

        case "Add New Role":
          addRoles();
          break;

        case "Add New Employee":
          addEmployee();
          break;

        case "View All Employees":
          viewAll("employee");
          start();
          break;

        case "View All Roles":
          viewAll("role");
          start();
          break;

        case "View all Departments":
          viewDepartments("dept");
          start();
          break;

        case "Change an Employee Role":
          updateEmployeeRole();
          start();
          break;

        case "Exit":
          connection.end();
      }

    });
}


function viewDepartments() {
  ui.log.write("Selecting all Departments...\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

//ADD department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "dept",
      message: "Enter department name:",
    }).then(function (answer) {
      var query = "INSERT INTO department SET ?";
      connection.query(query, {name: answer.dept}, function (err) {
          if (err) throw err;
          ui.log.write("Department added!");
          // start();
      });
    });
};

function addRoles() {
  // let departmentArr = [];
  // connection.query("SELECT * FROM department", (err, res) => {
  //   if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Input Job Title"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for the role you are adding?",
          validate: function (salary) {
            if (isNaN(salary) === false) {
              return true;
            }
            return ("Please enter numeric values only");
          }
        },
        {
          type: "rawlist",
          name: "dept",
          choices: () => {
            for (var i = 0; i < res.length; i++) {
              departmentArr.push(res[i].name);
            }
            return departmentArr;
          },
          message: "Select department for new role:",
        },
      ]).then((newRole) => {
        let indexDepartment = departmentArr.indexOf(newRole.dept);
        let deptId = res[indexDepartment].id;
        connection.query(
          "INSERT INTO role SET?",
          {
            title: newRole.title,
            salary: newRole.salary,
            department_id: deptId,
          },
          function (err) {
            if (err) throw err;
            ui.log.write("Your role has been added!");
            start();
          }
        );
      });
  // });
}


function viewAll(table) {
  connection.query(`SELECT * FROM ${table}`, function (err, res) {
    if (err) throw err;
    console.table(res);

  });
}
// ADD Employee -----
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter first name:"

      },
      {
        type: "input",
        name: "lastName",
        message: "Enter last name:"

      },

      {
        type: "input",
        name: "empManagerId",
        message: "What is the employee's manager id?",
        validate: function (salary) {
          if (isNaN(salary) === false) {
            return true;
          }
          return ("Numeric values only");
        }

      }
    ]).then(function (onboard) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: onboard.first_name,
          last_name: onboard.lastName,
          manager_id: onboard.empManagerId,
        },
        function (err) {
          if (err) throw err;
          ui.log.write("Employee has been added!");
          start();
        }
      );
    });

}
//UPDATE Employee
function updateEmployeeRole() {
  let employeeArr = [];
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "choice",
          choices: function () {
            employeeArr = [];
            for (var i = 0; i < res.length; i++) {
              employeeArr.push({
                name: `${res[i].first_name} ${res[i].last_name}`,
                value: res[i].id
              });
            }
            return employeeArr;
          },
          message: "Select employee:"
        },

      ]).then(function (res) {
        var roleArr = [];
        ui.log.write(res)
        let employeeId = res.choice;

        connection.query("SELECT * FROM role", (err, res) => {
          if (err) throw err;

          inquirer.prompt([
            {
              type: "rawlist",
              name: "roleChange",
              choices: () => {
                for (var i = 0; i < res.length; i++) {
                  roleArr.push({
                    name: res[i].title,
                    value: res[i].id
                  });
                }
                return roleArr;
              },
              message: "Select new employee role:",
            },
          ]).then((res) => {
            let updatedRoleId = res.roleChange;
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [{ role_id: updatedRoleId }, { id: employeeId }],
              (err, res) => {
                if (err) throw err;
                ui.log.write("Role updated!");
                start();
              }
            );
          });
        });
      });
  });


};

//VIEW ALL -----
// function viewAllEmployees() {
//   connection.query("SELECT * FROM employee", (err, res) => {
//     if (err) throw err;
//     let employeeArr = [];
//     let employee = {};
//     for (var i = 0; i < res.length; i++) {
//       employeeArr.push(`${res[i].first_name}${res[i].last_name}`);
//     }
//   });
// };



start()