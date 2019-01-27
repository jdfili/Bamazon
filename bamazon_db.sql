DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT(10),
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Cheese Wheel', 'Food', 10, 100), ('Healing Potion', 'Medicine', 50, 30),
    ('Steel Sword', 'Weapons', 150, 5), ('Glass Helm', 'Armor', 500, 2), ('Bronze Shield', 'Armor', 75, 10),
    ('Dope Sword (Specialized Sword)', 'Weapons', 1000, 1), ('Deer Meat', 'Food', 20, 75),('Mana Potion', 'Medicine', 45, 50),
    ('Bronze Axe', 'Weapons', 75, 20), ('Ale', 'Food', 15, 50);