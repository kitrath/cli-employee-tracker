const queries = {
    getAllDepts() {
        return 'SELECT * from department';
    },

    getAllRoles() {
        return 'SELECT role.id AS `Role ID`, role.title AS `Job Title`, department.name AS `Department`, role.salary AS `Salary` FROM role JOIN department ON role.department_id = department.id';
    },

    getAllEmployees() {
        return 'SELECT e.id AS `Id`, e.first_name AS `First Name`, e.last_name AS `Last Name`, role.title AS `Job Title`, department.name AS `Department`, role.salary AS `Salary`, COALESCE(CONCAT(m.first_name, \' \', m.last_name), \'N\/A\') AS `Manager` FROM employee e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id;';
    },

    checkEmployeeName() {
        return 'SELECT EXISTS(SELECT * FROM employee WHERE first_name = ? AND last_name = ?);';
    },

    checkRoleTitle() {
        return 'SELECT title from role;';
    },

    checkDeptName() {
        return 'SELECT name from department';
    }
    
}

module.exports = queries;