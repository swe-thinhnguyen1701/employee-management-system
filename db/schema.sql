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
    department integer,
    foreign key (department) references departments(id)
);

create table employees (
    id serial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer,
    manager_id integer,
    foreign key (role_id) references roles(id),
    foreign key (manager_id) references employees(id)
);