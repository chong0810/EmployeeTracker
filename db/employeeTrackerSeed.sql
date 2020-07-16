-- initial data for the database

INSERT INTO department (name) VALUES ("IT"),("Marketing"),("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer",100000,1),
("Collaborator", 45000,2),
("Recruiter",60000,3);

INSERT INTO employee (first_name, last_name,role_id) 
VALUES ("Geek", "Nerd", 1),
("Famous", "Guy", 2),
("Strict", "Person", 3);

