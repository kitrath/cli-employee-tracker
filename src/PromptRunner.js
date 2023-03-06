const inquirer = require('inquirer');

class PromptRunner {
    constructor(queryObject, dbConnection, displayMethod) {
        this.qys = queryObject;
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
                this.viewAllDepts();
                break;
            case 'view all roles':
                this.viewAllRoles();
                break;
            case 'view all employees':
                this.viewAllEmployees();
                break
            default:
                console.log("That option isn't available right now...");
                this.displayMainMenu();
        }
    }

    viewAllDepts() {
        this.db.query(this.qys.getAllDepts(), (err, result) => {
            if (err) {
                console.error(err);
            } else {
                this.dis
            }
        })
    }
}

module.exports = PromptRunner;