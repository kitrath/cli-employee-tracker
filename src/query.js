const queries = {
    getAllDepts() {
        return 'SELECT * from department';
    },

    getAllRoles() {
        return 'SELECT role.id AS `Role ID`, role.title AS `Job Title`, department.name AS `Department`, role.salary AS `Salary` FROM role JOIN department ON role.department_id = department.id';
    }
}
module.exports = queries;