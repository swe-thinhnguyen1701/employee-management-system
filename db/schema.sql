drop database if exists employee_db;
create database employee_db;

\c employee_db;

create table departments (
    id serial primary key,
    name varchar(30) not null
);

create table roles (
    id serial primary key,
    title varchar(30) not null,
    salary decimal not null,
    department_id integer,
    foreign key (department_id) references departments(id)
);

create table employees (
    id serial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer,
    manager_id integer default null,
    foreign key (role_id) references roles(id),
    foreign key (manager_id) references employees(id) ON DELETE SET NULL
);