CREATE DATABASE samskriti_billing;

USE samskriti_billing;

CREATE TABLE measurements (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
phone VARCHAR(20),

salwar JSON,
blouse JSON,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bills (
id INT AUTO_INCREMENT PRIMARY KEY,
bill_no VARCHAR(50),
bill_date DATE,
customer_name VARCHAR(100),
phone VARCHAR(20),

total DECIMAL(10,2),
advance_amount DECIMAL(10,2),
balance_amount DECIMAL(10,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_items (
id INT AUTO_INCREMENT PRIMARY KEY,
bill_id INT,

item_name VARCHAR(100),
qty INT,
rate DECIMAL(10,2),
amount DECIMAL(10,2),

FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
);