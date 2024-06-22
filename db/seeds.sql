insert into departments (name)
values  ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

insert into roles (title, salary, department_id)
values  ('Sale Lead', 100000, 4),
        ('Salesperson', 80000, 4),
        ('Lead Engineer', 150000, 1),
        ('Software Engineer', 120000, 1),
        ('Account Manager', 160000, 2),
        ('Accountant', 125000, 2),
        ('Legal Team Lead', 250000, 3),
        ('Lawyer', 190000, 3);

insert into employees(first_name, last_name, role_id, manager_id)
values  ('John', 'Doe', 1, null),
        ('Mike', 'Chan', 2, 1);