INSERT INTO department (name)
values ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 225000, 3),
       ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL),
       ("Kimber", "Jones", 2, 1),
       ("Michael", "Scorcese", 2, 1),
       ("Donovan", "Mitchell", 3, NULL),
       ("Elizabeth", "Martin", 4, 4),
       ("Krishnan", "Singh", 4, 4),
       ("Erica", "Yu", 4, 4),
       ("Deborah", "Soh", 5, NULL),
       ("Yolanda", "Jackson", 6, 8),
       ("Mary", "Crawford", 7, NULL),
       ("Sean", "Blackstone", 8, 10),
       ("Martin", "Kim", 8, 10);
