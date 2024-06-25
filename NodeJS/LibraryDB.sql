CREATE DATABASE IF NOT EXISTS LibraryDB;
USE LibraryDB;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS borrows;
DROP TABLE IF EXISTS waiting;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS copyBook;
DROP TABLE IF EXISTS booksInLibrary;
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
  libraryName VARCHAR(50) NOT NULL,
  address VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL
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
  subscriptionTypeId INT default NULL,
  roleId INT NOT NULL,
  libraryId INT NOT NULL,
  passwordId INT NOT NULL,
  FOREIGN KEY (subscriptionTypeId) REFERENCES subscriptionTypes(id),
  FOREIGN KEY (roleId) REFERENCES roles(id),
  FOREIGN KEY (libraryId) REFERENCES libraries(id),
  FOREIGN KEY (passwordId) REFERENCES passwords(id)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nameBook VARCHAR(50) NOT NULL,
  author VARCHAR(50) NOT NULL,
  numOfPages INT NOT NULL,
  publishingYear YEAR NOT NULL,
  summary VARCHAR(255) NOT NULL,
  image VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL
);

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookId INT NOT NULL,
  numLikes INT NOT NULL,
  FOREIGN KEY (bookId) REFERENCES books(id)
);

CREATE TABLE booksInLibrary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  libraryId INT NOT NULL,
  bookId INT NOT NULL,
  unitsInStock INT NOT NULL,
  isNew BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (libraryId) REFERENCES libraries(id),
  FOREIGN KEY (bookId) REFERENCES books(id)
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
  bookInLibraryId INT NOT NULL,
  isAvailable BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (bookInLibraryId) REFERENCES booksInLibrary(id)
);

CREATE TABLE borrows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  copyBookId INT NOT NULL,
  userId INT NOT NULL,
  borrowDate DATE NOT NULL,
  returnDate DATE default NULL,
  status VARCHAR(50)  CHECK (status IN ('Borrowed', 'Returned', 'Overdue')),
  isReturned BOOLEAN  DEFAULT TRUE,
  isIntact BOOLEAN DEFAULT TRUE,
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

INSERT INTO libraries (libraryName, address, phone) VALUES 
('Central Library', 'fdg', '026554567'), 
('Westside Library', 'fdg', '026533907'), 
('Eastside Library', 'fdg', '026523205');

INSERT INTO passwords (password) VALUES 
('$2b$10$q6n4J8qQg5x9LLhFY8O1GefHpPCOAQDoc/DqD7lSPiC87TaZ3mwIG'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.JyenO/2UglhLRxuLnISu0tK7srjDOWi'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.2sIOfvB1CDwb7hiDtFtcWSfnlx7/9x6'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.EatKcZ8GRvesfm1pcUxPGVjr6BqUoW.'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.rP.EEJ9jEa3j7iCTpS3U6htGj0djdKO'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.M6qwRZVXdJ3cgQsaTLzkuCk09Lmf6oO'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.pjvNFn3JG6AnADsAqzeRQeK7k5xqrrS'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.BAqwaVnAizdAkpVo05Ijfejn50F.i0O'),
('$2b$10$L/W/YTql1OFd2kk1cva3q.8n87T4KouYBTYtBPWR6ZwoYS4u6oZry'),
('$2b$10$L/W/YTql1OFd2kk1cva3q..bNaKcOJDiiy9JwhSlIRpcaWR8cRk9G');

INSERT INTO users (username, phone, email, address, subscriptionTypeId, roleId, libraryId, passwordId) VALUES 
('Alice', '123-456-7890', 'alice@example.com', '123 Main St', 1, 1, 1, 1),
('Bob', '987-654-3210', 'bob@example.com', '456 Elm St', 2, 2, 2, 2),
('Charlie', '555-555-5555', 'charlie@example.com', '789 Oak St', 1, 3, 1, 3),
('David', '222-222-2222', 'david@example.com', '321 Pine St', 2, 2, 2, 4),
('Emma', '333-333-3333', 'emma@example.com', '456 Maple St', 1, 3, 3, 5),
('Frank', '444-444-4444', 'frank@example.com', '987 Cedar St', 1, 3, 1, 6),
('Grace', '666-666-6666', 'grace@example.com', '654 Birch St', 2, 2, 2, 7),
('Henry', '777-777-7777', 'henry@example.com', '753 Walnut St', 1, 3, 3, 8),
('Ivy', '888-888-8888', 'ivy@example.com', '147 Cherry St', 1, 3, 1, 9),
('Jack', '999-999-9999', 'jack@example.com', '369 Spruce St', 2, 2, 2, 10);

INSERT INTO books (nameBook, author, numOfPages, publishingYear, summary, image, category) VALUES 
('המסע הארוך של נאן', 'לאה פריד', 200, '2020', 'Summary of Book 1', 'nahn.jpg', 'Fiction'),
('המצולע', 'יונה ספיר', 300, '2019', 'Summary of Book 2', 'metsula.jpg', 'Non-Fiction'),
('הנורמלי האחרון', 'רותי קפלר', 250, '2018', 'Summary of Book 3', 'hanormali-haacharon.jpg', 'Fiction'),
('שלנו את סרינה', 'רותי טננולד', 180, '2017', 'Summary of Book 4', 'shelanuatsarina.jpg', 'Fiction'),
('שטח סגור', 'דבורה רוזן', 320, '2016', 'Summary of Book 5', 'shetach-sagur.jpg', 'Fiction'),
('בכל עת', 'ליבי קליין', 270, '2015', 'Summary of Book 6', 'bechol-et.jpg', 'Fiction'),
('אשא עיניי', 'ליבי קליין', 230, '2014', 'Summary of Book 7', 'EsaEinay.jpg', 'Science Fiction'),
('איך לא ידעתי', 'חנה רוטנברג', 280, '2013', 'Summary of Book 8', 'howDidnotIKnow.jpg', 'Historical Fiction'),
('תיק מקסיקו', 'חיים גרינבוים', 290, '2012', 'Summary of Book 9', 'tik-mexico.jpg', 'Fiction'),
('הקוקייה', 'אסתר קווין', 210, '2011', 'Summary of Book 10', 'hkukiya.jpg', 'Fiction');

INSERT INTO likes (bookId, numLikes) VALUES 
(1, 100), 
(2, 150), 
(3, 120), 
(4, 80), 
(5, 200), 
(6, 140), 
(7, 110), 
(8, 160), 
(9, 170), 
(10, 130);


INSERT INTO booksInLibrary (libraryId, bookId, unitsInStock, isNew) VALUES 
(1, 1, 50, FALSE),
(2, 2, 75, TRUE),
(3, 3, 60, FALSE),
(1, 4, 40, TRUE),
(2, 5, 100, FALSE),
(3, 6, 65, TRUE),
(1, 7, 55, FALSE),
(2, 8, 80, TRUE),
(3, 9, 85, FALSE),
(1, 10, 70, TRUE);

INSERT INTO comments (title, body, userId, bookId) VALUES 
('סופרת ותיקה', 'ספר יפה ומרגש ככ נוסטלגי', 1, 1),
('Comment 2', 'Body of Comment 2', 2, 2),
('Comment 3', 'Body of Comment 3', 3, 3),
('Comment 4', 'Body of Comment 4', 4, 4),
('Comment 5', 'Body of Comment 5', 5, 5),
('Comment 6', 'Body of Comment 6', 6, 6),
('Comment 7', 'Body of Comment 7', 7, 7),
('Comment 8', 'Body of Comment 8', 8, 8),
('Comment 9', 'Body of Comment 9', 9, 9),
('Comment 10', 'Body of Comment 10', 10, 10);

INSERT INTO copyBook (bookInLibraryId, isAvailable) VALUES 
(1, true),
(2, true),
(3, true),
(4, false),
(1, true),
(6, true),
(10, true),
(8, true),
(9, true),
(10, true);

INSERT INTO borrows (copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) VALUES 
(1, 1, '2024-05-10', NULL, 'Borrowed', FALSE, TRUE),
(2, 1, '2024-05-15', '2024-06-15', 'Returned', TRUE, TRUE),
(3, 1, '2024-05-20', '2024-06-20', 'Returned', TRUE, TRUE),
(4, 1, '2024-05-25', NULL, 'Borrowed', FALSE, TRUE),
(5, 1, '2024-05-30', NULL, 'Borrowed', FALSE, TRUE),
(6, 5, '2024-06-05', NULL, 'Borrowed', FALSE, TRUE),
(7, 7, '2024-06-10', NULL, 'Borrowed', FALSE, TRUE),
(8, 8, '2024-06-15', NULL, 'Borrowed', FALSE, TRUE),
(9, 9, '2024-06-20', NULL, 'Borrowed', FALSE, TRUE),
(2, 5, '2024-06-25', NULL, 'Borrowed', FALSE, TRUE);

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
