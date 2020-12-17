
const inquirer = require("inquirer");
const cTable = require("console.table");
const ui = new inquirer.ui.BottomBar();
const connection = require("./config/connection").connection
// emitter.setMaxListeners(30);

//Main Prompt Menu
function menu() {
  inquirer.prompt({
    type: "rawlist",
    name: "action",
    message: "Please Select:",
    choices: ["Add New Department", "Add New Role", "Add New Employee", "View All Employees", "View All Roles", "View Departments", "Change an Employee Role", "Exit"]
  }).then((answer) => {
    switch (answer.action) {
      case "Add New Department":
        addDept();
        break;

      case "Add New Role":
        addRole();
        break;

      case "Add New Employee":
        addEmpl();
        break;

      case "View All Employees":
        viewEmpl();
        menu();
        break;

      case "View All Roles":
        viewRole();
        menu();
        break;

      case "View all Departments":
        viewDept();
        menu();
        break;

      case "Change an Employee Role":
        updateEmpl();
        break;

      case "Exit":
        connection.end();
        console.log("Good-Bye");
        break;
    }
  }).catch(error => {
    if (error) throw error;
  });
};



//ADD department
function addDept() {
  inquirer.prompt({
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

function addRole() {
  const deptArr = []
  connection.query("SELECT * FROM department", (error, res) => {
    if (error) throw error;
    inquirer.prompt([
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
            deptArr.push(res[i].name);
          }
          return deptArr;
        },
        message: "Select department for new role:",
      },
    ]).then(answer => {
      let indexDepartment = deptArr.indexOf(answer.dept);
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

function addEmpl() {
  let roleArr = [];
  connection.query("SELECT * FROM roles", (error, res) => {
    if (error) throw error;
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee's first name:",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee's last name",
      },
      {
        name: "role",
        type: "rawlist",
        choices: () => {
          for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
          }
          return roleArr;
        },
        message: "Select employee's role:",
      },
    ]).then(answer => {
      let indexRole = roleArr.indexOf(answer.role);
      let role = res[indexRole].id;
      let firstName = answer.firstName;
      let lastName = answer.lastName;
      let managerArr = ["None"];
      connection.query("SELECT * FROM employee", (error, res) => {
        if (error) throw error;
        inquirer.prompt([
          {
            name: "manager",
            type: "rawlist",
            choices: () => {
              for (var i = 0; i < res.length; i++) {
                managerArr.push(
                  `${res[i].first_name} ${res[i].last_name}`
                );
              }
              return managerArr;
            },
            message: "Assign employee's manager:",
          },
        ]).then((answer) => {
          if (answer.manager !== "None") {
            let indexMan = managerArr.indexOf(answer.manager) - 1;
            let managerId = res[indexMan].id;
            insertEmployee(firstName, lastName, role, managerId);
          } else {
            let managerId = null;
            insertEmployee(firstName, lastName, role, managerId);
          }
        });
      });
    });
  });
  function insertEmployee(firstName, lastName, role, managerId) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: firstName,
        last_name: lastName,
        role_id: role,
        manager_id: managerId,
      },
      error => {
        if (error) throw error;
        console.log("Your employee was successfully added!");
        menu();
      }
    );
  };
};


function viewDept() {
  connection.query("SELECT * FROM department", (error, res) => {
    if (error) throw error;
    let deptArr = [];
    for (var i = 0; i < res.length; i++) {
      deptArr.push(res[i].name);
    };
    console.table("Departments", [deptArr]);
    menu();
  });
};

function viewRole() {
  connection.query("SELECT * FROM roles", (error, res) => {
    if (error) throw error;
    let rolesArr = [];
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    };
    console.table("Roles", [rolesArr]);
    menu();
  });
};

function viewEmpl() {
  connection.query("SELECT * FROM employee", (error, res) => {
    if (error) throw error;
    let emplArr = [];
    for (var i = 0; i < res.length; i++) {
      emplArr.push(`${res[i].first_name} ${res[i].last_name}`);
    };
    console.table("Employees", [emplArr]);
    menu();
  });
};


menu();
