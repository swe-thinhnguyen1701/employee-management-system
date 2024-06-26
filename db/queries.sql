SELECT
    e.first_name,
    e.last_name,
    r.title,
    r.salary,
    d.name AS department,
    COALESCE(m.first_name || ' ' || m.last_name, 'NULL') AS manager
FROM
    employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department = d.id
    LEFT JOIN employees m ON e.manager_id = m.id;

SELECT
    CONCAT(e.first_name, ' ', e.last_name) AS name,
    r.title
FROM
    employees e
    JOIN roles r ON e.role_id = r.id
WHERE
    e.manager_id = $ 1;

SELECT
    SUM(salary) AS Budget
FROM
    employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id
WHERE
    d.id = $ 1;