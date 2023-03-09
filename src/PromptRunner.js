const inquirer = require('inquirer');
const { addEmployee } = require('./query');

class PromptRunner {
    constructor(queryObject, dbConnection, displayMethod) {
        this.queries = queryObject;
        this.db = dbConnection;
        this.display = displayMethod;
        this.mainMenuItems = [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role"
        ];
    }

    displayMainMenu() {
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "option",
                    message: "Please Select One of the Following Options:",
                    choices: this.mainMenuItems
                }
            ])
            .then(answer => this.routeMainMenuOptions(answer.option))
            .catch(err => console.error(err));
    }

    routeMainMenuOptions(choice) {
        const next = choice.toLowerCase().trim();
        switch (next) {
            case 'view all departments':
                this.viewAll('department');
                break;
            case 'view all roles':
                this.viewAll('role');
                break;
            case 'view all employees':
                this.viewAll('employee');
                break
            case 'add a department':
                this.addDept();
                break;
            case 'add a role':
                this.getDataForAddRole();
                break;
            case 'add an employee':
                this.getManagersForAddEmployee();
            default:
                console.log("That option isn't available right now...");
                this.displayMainMenu();
        }
    }

    viewAll(table) {
        const q = this.queries;
        const qMap = {
            'department': q.getDepts,
            'role': q.getDisplayRoles,
            'employee': q.getDisplayEmployees,
        };
        this.db.query(qMap[table](), (err, result) => {
            if (err) {
                console.error(err);
            } else {
                this.display(result);
                this.displayMainMenu();
            }
        });
    }

    addDept() {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "department",
                    message: "Enter a department name:",
                    validate: val => this._isValidString(val)
                }
            ])
            .then(answer => {
                const q = this.queries;
                const name = answer.department.trim();
                this.db.query(q.checkDeptName(), name, (err, results) => {
                    if (err) console.error(err);
                    const inDatabase = results[0]['in_db'];
                    if (inDatabase) {
                        console.log(`\n*** ${name} department already in the database. ***\n`);
                        this.displayMainMenu();
                    } else {
                        this.db.query(q.addDept(), name, (err) => {
                            if (err) console.error(err);
                            console.log(`\n** ${name} department added to the database. **\n`);
                            this.displayMainMenu();
                        });
                    }
                });
            });
    }

    getDataForAddRole() {
        const q = this.queries;
        this.db.query(q.getDepts(), (err, results) => {
            if (err) console.error(err);
            this.addRole(results);
        });
    }

    addRole(departments) {
        const deptNames = departments.map(elem => elem.name);
        console.log("deptNames", deptNames);
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter a role title:"
                },
                {
                    type: "list",
                    name: "department",
                    message: "Choose a department",
                    choices: deptNames
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter a salary",
                    validate: num => {
                        if (isNaN(num) || num <= 0) {
                            return "Salary must be a positive number";
                        }
                        return true;
                    }
                }
            ])
            .then(answers => {
                const q = this.queries;
                const deptId = this._getIdForKeyName('name', answers.department, departments);
                const title = answers.title.trim();
                const salary = parseInt(answers.salary, 10);

                this.db.query(q.addRole(), [title, salary, deptId], (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`\n** ${title} role added to the database. **\n`)
                        this.displayMainMenu();
                    }

                });
            });
            
    }

    getManagersForAddEmployee() {
        const q = this.queries;
        this.db.query(q.getManagers(), (err, results) => {
            if (err) {
                console.error(err);
            } else {
                // results [{ id: , name: <first_name Last_name> }]
                this.getRolesTruncated(results);
            }
        })
    }

    getRolesForAddEmployee(managers) {
        const q = this.queries;
        this.db.query(q.getRolesTruncated(), (err, results) => {
            if (err) {
                console.error(err);
            } else {
                this.addEmployee(managers, results);
            }
        });
    }

    addEmployee(managers, roles) {
        const managersList = managers.map(manager => manager.name);
        // Some employees have no manager
        managersList.shift('None');
        const rolesList = roles.map(role => role.title);
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter employee's first name:",
                    validate: val => this._isValidString(val)
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter employee's last name",
                    validate: val => this._isValidString(val)
                },
                {
                    type: "list",
                    name: "role",
                    message: "Choose the employee's role:",
                    choices: rolesList
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Choose the employee's manager",
                    choices: managersList
                }
            ])
            .then(answers => {
                const manager = answers.manager.trim();
                const firstName = answers.first_name.trim();
                const lastName = answers.last_name.trim();
                const roleId = this._getIdForKeyName('title', answers.role, roles);

                let managerId;
                if (manager !== 'None') {
                    managerId = this._getIdForKeyName('name', answers.manager, managers) 
                } else {
                    managerId = null;
                }                

                const q = this.queries;
                this.db.query(q.addEmployee(), [firstName, lastName, roleId, managerId], (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`\n** Employee ${first_name} ${last_name} added to the database. **\n`);
                        this.displayMainMenu();
                    }
                });
            });
    }

    _getIdForKeyName(key, name, list) {
        for (const item of list) {
            if (item[key] === name) {
                return item.id;
            }
        }
    }
    _isValidString(str) {
        const s = str.trim();
        if (!s.trim().length || !isNaN(s)) return "Please enter a valid string";
        return true;
    }

    init() {
        this.displayMainMenu();
    }
}

module.exports = PromptRunner;