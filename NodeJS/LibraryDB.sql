
CREATE DATABASE IF NOT EXISTS LibraryDB;
USE LibraryDB;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS barrows;
DROP TABLE IF EXISTS waiting;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS copyBook;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS libraries;
DROP TABLE IF EXISTS subscriptionTypes;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roleName ENUM('administrator', 'employee', 'customer') NOT NULL
);


CREATE TABLE subscriptionTypes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  typeName VARCHAR(50) NOT NULL,
  ammountToBorrow INT NOT NULL
);

CREATE TABLE libraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  libraryName VARCHAR(50) NOT NULL
);


CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  creditCardNumber VARCHAR(16) NOT NULL,
  expirationDate DATE NOT NULL,
  cvv INT NOT NULL
);

CREATE TABLE passwords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  address VARCHAR(50),
  subscriptionTypeId INT NOT NULL,
  roleId INT NOT NULL,
  libraryId INT NOT NULL,
  paymentId INT NOT NULL,
  passwordId INT NOT NULL,
  FOREIGN KEY (subscriptionTypeId) REFERENCES subscriptionTypes(id),
  FOREIGN KEY (roleId) REFERENCES roles(id),
  FOREIGN KEY (libraryId) REFERENCES libraries(id),
  FOREIGN KEY (paymentId) REFERENCES payments(id),
  FOREIGN KEY (passwordId) REFERENCES passwords(id)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nameBook VARCHAR(50) NOT NULL,
  author VARCHAR(50) NOT NULL,
  numOfPages INT NOT NULL,
  publishingYear YEAR NOT NULL,
  likes INT,
  summary VARCHAR(255) NOT NULL,
  image BLOB NOT NULL,
  unitsInStock INT NOT NULL,
  category VARCHAR(30) NOT NULL,
  libraryId INT NOT NULL,
  isNew BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (libraryId) REFERENCES libraries(id)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  body VARCHAR(255) NOT NULL,
  userId INT,
  bookId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (bookId) REFERENCES books(id)
);


CREATE TABLE copyBook (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookId INT NOT NULL,
  libraryId INT NOT NULL,
  isAvailable BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (libraryId) REFERENCES libraries(id)
);

CREATE TABLE barrows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  copyBookId INT NOT NULL,
  userId INT NOT NULL,
  borrowDate DATE NOT NULL,
  returnDate DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Borrowed', 'Returned', 'Overdue')),
  isReturned BOOLEAN NOT NULL DEFAULT FALSE,
  isIntact BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (copyBookId) REFERENCES copyBook(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE messages(
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  body VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('read', 'didnt read yet')),
  readDate DATE,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE waiting(
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  bookId INT NOT NULL,
  forwait DATE,
  requestDate DATE,
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (userid) REFERENCES users(id)
);

INSERT INTO roles (roleName) VALUES 
('administrator'), 
('employee'), 
('customer');

INSERT INTO subscriptionTypes (typeName, ammountToBorrow) VALUES 
('Monthly', 10), 
('Yearly', 50);

INSERT INTO libraries (libraryName) VALUES 
('Central Library'), 
('Westside Library'), 
('Eastside Library');

INSERT INTO payments (creditCardNumber, expirationDate, cvv) VALUES 
('1234567812345678', '2025-12-31', 123),
('8765432187654321', '2024-11-30', 456);

INSERT INTO passwords (password) VALUES 
('password1'),
('password2'),
('password3'),
('password4'),
('password5'),
('password6'),
('password7'),
('password8'),
('password9'),
('password10');

INSERT INTO users (username, phone, email, address, subscriptionTypeId, roleId, libraryId, paymentId, passwordId) VALUES 
('Alice', '123-456-7890', 'alice@example.com', '123 Main St', 1, 1, 1, 1, 1),
('Bob', '987-654-3210', 'bob@example.com', '456 Elm St', 2, 2, 2, 2, 2),
('Charlie', '555-555-5555', 'charlie@example.com', '789 Oak St', 1, 3, 1, 2, 3),
('David', '222-222-2222', 'david@example.com', '321 Pine St', 2, 2, 2, 1, 4),
('Emma', '333-333-3333', 'emma@example.com', '456 Maple St', 1, 3, 3, 2, 5),
('Frank', '444-444-4444', 'frank@example.com', '987 Cedar St', 1, 3, 1, 2, 6),
('Grace', '666-666-6666', 'grace@example.com', '654 Birch St', 2, 2, 2, 1, 7),
('Henry', '777-777-7777', 'henry@example.com', '753 Walnut St', 1, 3, 3, 2, 8),
('Ivy', '888-888-8888', 'ivy@example.com', '147 Cherry St', 1, 3, 1, 1, 9),
('Jack', '999-999-9999', 'jack@example.com', '369 Spruce St', 2, 2, 2, 2, 10);

INSERT INTO books (nameBook, author, numOfPages, publishingYear, likes, summary, image, unitsInStock, category, libraryId) VALUES 
('Book 1', 'Author 1', 200, '2020', 100, 'Summary of Book 1', 'book_images/book1.jpg', 50, 'Fiction', 1),
('Book 2', 'Author 2', 300, '2019', 150, 'Summary of Book 2', 'book_images/book2.jpg', 75, 'Non-Fiction', 2),
('Book 3', 'Author 3', 250, '2018', 120, 'Summary of Book 3', 'book_images/book3.jpg', 60, 'Fantasy', 3),
('Book 4', 'Author 4', 180, '2017', 80, 'Summary of Book 4', 'book_images/book4.jpg', 40, 'Mystery', 1),
('Book 5', 'Author 5', 320, '2016', 200, 'Summary of Book 5', 'book_images/book5.jpg', 100, 'Thriller', 2),
('Book 6', 'Author 6', 270, '2015', 140, 'Summary of Book 6', 'book_images/book6.jpg', 65, 'Romance', 3),
('Book 7', 'Author 7', 230, '2014', 110, 'Summary of Book 7', 'book_images/book7.jpg', 55, 'Science Fiction', 1),
('Book 8', 'Author 8', 280, '2013', 160, 'Summary of Book 8', 'book_images/book8.jpg', 80, 'Historical Fiction', 2),
('Book 9', 'Author 9', 290, '2012', 170, 'Summary of Book 9', 'book_images/book9.jpg', 85, 'Biography', 3),
('Book 10', 'Author 10', 210, '2011', 130, 'Summary of Book 10', 'book_images/book10.jpg', 70, 'Horror', 1);

INSERT INTO comments (title, body, userId, bookId) VALUES 
('Comment 1', 'Body of Comment 1', 1, 1),
('Comment 2', 'Body of Comment 2', 2, 2),
('Comment 3', 'Body of Comment 3', 3, 3),
('Comment 4', 'Body of Comment 4', 4, 4),
('Comment 5', 'Body of Comment 5', 5, 5),
('Comment 6', 'Body of Comment 6', 6, 6),
('Comment 7', 'Body of Comment 7', 7, 7),
('Comment 8', 'Body of Comment 8', 8, 8),
('Comment 9', 'Body of Comment 9', 9, 9),
('Comment 10', 'Body of Comment 10', 10, 10);

INSERT INTO copyBook (bookId, libraryId) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2),
(6, 3),
(7, 1),
(8, 2),
(9, 3),
(10, 1);

INSERT INTO barrows (copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) VALUES 
(1, 1, '2024-05-10', NULL, 'Borrowed', FALSE, TRUE),
(2, 2, '2024-05-15', '2024-06-15', 'Returned', TRUE, TRUE),
(3, 3, '2024-05-20', '2024-06-20', 'Returned', TRUE, TRUE),
(4, 4, '2024-05-25', NULL, 'Borrowed', FALSE, TRUE),
(5, 5, '2024-05-30', NULL, 'Borrowed', FALSE, TRUE),
(6, 6, '2024-06-05', NULL, 'Borrowed', FALSE, TRUE),
(7, 7, '2024-06-10', NULL, 'Borrowed', FALSE, TRUE),
(8, 8, '2024-06-15', NULL, 'Borrowed', FALSE, TRUE),
(9, 9, '2024-06-20', NULL, 'Borrowed', FALSE, TRUE),
(10, 10, '2024-06-25', NULL, 'Borrowed', FALSE, TRUE);

INSERT INTO messages (userId, title, body, status, readDate) VALUES 
(1, 'Title of Message 1', 'Body of Message 1', 'read', '2024-05-20'),
(2, 'Title of Message 2', 'Body of Message 2', 'didnt read yet', NULL),
(3, 'Title of Message 3', 'Body of Message 3', 'read', '2024-05-25'),
(4, 'Title of Message 4', 'Body of Message 4', 'didnt read yet', NULL),
(5, 'Title of Message 5', 'Body of Message 5', 'read', '2024-06-01'),
(6, 'Title of Message 6', 'Body of Message 6', 'didnt read yet', NULL),
(7, 'Title of Message 7', 'Body of Message 7', 'read', '2024-06-05'),
(8, 'Title of Message 8', 'Body of Message 8', 'didnt read yet', NULL),
(9, 'Title of Message 9', 'Body of Message 9', 'read', '2024-06-10'),
(10, 'Title of Message 10', 'Body of Message 10', 'didnt read yet', NULL);

INSERT INTO waiting (userId, bookId, forwait, requestDate) VALUES 
(1, 2, '2024-06-05', '2024-05-20'),
(2, 3, '2024-06-10', '2024-05-25'),
(3, 4, '2024-06-15', '2024-05-30'),
(4, 5, '2024-06-20', '2024-06-05'),
(5, 6, '2024-06-25', '2024-06-10'),
(6, 7, '2024-06-30', '2024-06-15'),
(7, 8, '2024-07-05', '2024-06-20'),
(8, 9, '2024-07-10', '2024-06-25'),
(9, 10, '2024-07-15', '2024-07-01'),
(10, 1, '2024-07-20', '2024-07-05');


