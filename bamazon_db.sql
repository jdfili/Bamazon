DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT(10),
    product_sales INT(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity,product_sales)
VALUES ('Brahmin Steak', 'Food', 10, 100,0), ('Stimpak', 'Medicine', 50, 30,0),
    ('Plasma Rifle', 'Weapons', 150, 5,0), ('Power Armor Helmet', 'Armor', 500, 2,0), ('Combat Boots', 'Armor', 75, 10,0),
    ('Shishkebab', 'Weapons', 1000, 1,0), ('Mirelurk Meat', 'Food', 20, 75,0),('Psycho', 'Medicine', 45, 50,0),
    ('10mm Pistol', 'Weapons', 75, 20,0), ('Purified Water', 'Food', 15, 50,0);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs INT(10),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Armor", 2500),("Weapons", 3000),("Medicine",2000),("Food",1500);