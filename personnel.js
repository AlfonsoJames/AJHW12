
const inquirer = require("inquirer");
const cTable = require("console.table");
const ui = new inquirer.ui.BottomBar();
const connection = require("./config/connection").connection

//Main Prompt Menu
function menu() {
  inquirer
    .prompt({
      type: "rawlist",
      name: "action",
      message: "Please Select:",
      choices: ["Add New Department", "Add New Role", "Add New Employee", "View All Employees", "View All Roles", "View Departments", "Change an Employee Role", "Exit"]
    }).then((answer) => {
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
          menu();
          break;

        case "View All Roles":
          viewAll("role");
          menu();
          break;

        case "View all Departments":
          viewDepartments("dept");
          menu();
          break;

        case "Change an Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    }).catch(error => {
      if (error) throw error;
    });
};



//ADD department
function addDepartment() {
    inquirer
      .prompt({
        name: "dept",
        type: "input",
        message: "Enter new department name:"
      }).then(answer => {
        var query = "INSERT INTO department SET?";
        connection.query(query, { name: answer.dept }, error => {
          if (error) throw error;
          console.log("Department added!");
          menu();
        });
      });    
  // });
};

function addRoles() {
  const departmentArr = []
  connection.query("SELECT * FROM department", (error, res) => {
    if (error) throw error;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter Job Title:"
        },
        {
          type: "input",
          name: "salary",
          message: "What is this role's salary?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return ("Numeric values only (NO '$' and ',' or '.'");
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
      ]).then(answer => {
        let indexDepartment = departmentArr.indexOf(answer.dept);
        let deptId = res[indexDepartment].id;
        connection.query(
          "INSERT INTO roles SET?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: deptId,
          },
          error => {
            if (error) throw error;
            console.log("Role added!");
            menu();
          }
        );
      });
  });
}

menu();


// function viewAll(table) {
//   connection.query(`SELECT * FROM ${table}`, function (error, res) {
//     if (error) throw error;
//     console.table(res);

//   });
// }
 