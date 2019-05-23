DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE products (
sku INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50),
price FLOAT NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (sku)
);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Pikachu', 'TOY', 20, 50), ('Blueberry chocolate', 'FOOD', 5, 100),
('Soft kitty CD', 'MUSIC', 8, 60), ('Unicycle', 'HOME', 100, 20),
('Grape seeds', 'HOME', 2, 30), ('Fur gloves', 'FASHION', 40, 25),
('Water baloons','TOY', 4, 100), ('Cat tree house', 'HOME', 80,20),
('Crunchy bars', 'FOOD', 1, 200), ('Killing me softly', 'MUSIC',12, 30) 