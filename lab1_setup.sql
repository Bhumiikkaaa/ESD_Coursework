CREATE DATABASE IF NOT EXISTS ecommerceDB;

USE ecommerceDB;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    stock INT NOT NULL
);

DELETE FROM products;

INSERT INTO products (name, description, price, category, stock)
VALUES
('Laptop', '15-inch laptop for everyday use', 65000.00, 'Electronics', 10),
('Wireless Mouse', 'Ergonomic wireless mouse', 1200.00, 'Accessories', 25),
('Mechanical Keyboard', 'RGB mechanical keyboard', 3500.00, 'Accessories', 15);