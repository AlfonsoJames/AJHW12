
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
  // connection.query("SELECT * FROM department", (error, res) => {
    // if (error) throw error;
    inquirer
      .prompt({
        name: "dept",
        type: "input",
        message: "Enter new department name:"
      }).then(answer => {
        var query = "INSERT INTO department SET?";
        connection.query(query, { name: answer.dept }, function (error, res) {
          if (error) throw error;
          console.log("Department added!");
          menu();
        });
      });    
  // });
};

  function addRoles() {
    let departmentArr = []
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
            validate: function (salary) {
              if (isNaN(salary) === false) {
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
        ]).then(newRole => {
          let indexDepartment = departmentArr.indexOf(newRole.dept);
          let deptId = res[indexDepartment].id;
          connection.query(
            "INSERT INTO role SET?",
            {
              title: newRole.title,
              salary: newRole.salary,
              department_id: deptId,
            },
            function (error) {
              if (error) throw error;
              console.log("Role added!");
              menu();
            }
          );
        });
    });
  }


  function viewAll(table) {
    connection.query(`SELECT * FROM ${table}`, function (error, res) {
      if (error) throw error;
      console.table(res);

    });
  }
  // ADD Employee -----
  function addEmployee() {
    let roleArray = [];
    connection.query("SELECT * FROM role", (err, res) => {
        inq.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter first name:",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter last name:",
            },
            {
                name: "role",
                type: "rawlist",
                choices: () => {
                    for (var i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "Assign Role:",
            },
        ]).then((answer) => {
            let indexRole = roleArray.indexOf(answer.role);
            let role = res[indexRole].id;
            let firstName = answer.firstName;
            let lastName = answer.lastName;
            let managerArray = ["None"];
            connection.query("SELECT * FROM employee", (err, res) => {
                if (err) throw err;
                inq.prompt([
                    {
                        name: "manager",
                        type: "rawlist",
                        choices: () => {
                            for (var i = 0; i < res.length; i++) {
                                managerArray.push(
                                    `${res[i].first_name} ${res[i].last_name}`
                                );
                            }
                            return managerArray;
                        },
                        message: "Assign Manager",
                    },
                ]).then((answer) => {
                    if (answer.manager !== "None") {
                        let indexMan = managerArray.indexOf(answer.manager) - 1;
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
}

function insertEmployee(firstName, lastName, role, managerId) {
    connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: firstName,
            last_name: lastName,
            role_id: role,
            manager_id: managerId,
        },
        (err) => {
            if (err) throw err;
            console.log("employee added!");
            start();
        }
    );
}
  // function addEmployee() {
  //   let managerIdArr = [];
  //   connection.query("SELECT * FROM employee", (error, res) => {
  //     if (error) throw error;
  //     inquirer
  //       .prompt([
  //         {
  //           type: "input",
  //           name: "firstName",
  //           message: "Enter first name:"

  //         },
  //         {
  //           type: "input",
  //           name: "lastName",
  //           message: "Enter last name:"

  //         },

  //         {
  //           type: "list",
  //           name: "managerId",
  //           message: "Assign Manager ID",
  //           choices: () => {
  //             for (var i = 0; i < res.length; i++) {
  //               managerIdArr.push(res[i].name);
  //             }
  //             return managerIdArr;
  //           },
  //         }
  //       ]).then(function (onboard) {
  //         connection.query("INSERT INTO employee SET ?",
  //           {
  //             first_name: onboard.first_name,
  //             last_name: onboard.last_Name,
  //             manager_id: onboard.department_id,
  //           },
  //           function (error) {
  //             if (error) throw error;
  //             ui.log.write("Employee onboarded!");
  //             menu();
  //           }
  //         );
          // connection.query(
          //   "INSERT INTO employee SET?",
          //   {
          //     manager_id: deptId,
          //   },
          //   function (error) {
          //     if (error) throw error;
          //     ui.log.write("Assigned to Dept. Manager!");
          //     menu();
          //   }
          // );
  //       });
  //   });
  // };
  //UPDATE Employee
  function updateEmployeeRole() {
    let employeeArr = [];
    connection.query("SELECT * FROM employee", (error, res) => {
      if (error) throw error;
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

          connection.query("SELECT * FROM role", (error, res) => {
            if (error) throw error;

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
                message: "Assign new role:",
              },
            ]).then((res) => {
              let updatedRoleId = res.roleChange;
              connection.query(
                "UPDATE employee SET ? WHERE ?",
                [{ role_id: updatedRoleId }, { id: employeeId }],
                (error, res) => {
                  if (error) throw error;
                  ui.log.write("Role updated!");
                  menu();
                }
              );
            });
          });
        });
    });


  };

  //VIEW ALL -----
  // function viewAllEmployees() {
  //   connection.query("SELECT * FROM employee", (error, res) => {
  //     if (error) throw error;
  //     let employeeArr = [];
  //     let employee = {};
  //     for (var i = 0; i < res.length; i++) {
  //       employeeArr.push(`${res[i].first_name}${res[i].last_name}`);
  //     }
  //   });
  // };



  menu()