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
  roleName VARCHAR(50) NOT NULL
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
  isWarned BOOLEAN DEFAULT FALSE,
  subscriptionTypeId INT default NULL,
  roleId INT NOT NULL,
  libraryId INT DEFAULT NULL,
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
  image VARCHAR(200) NOT NULL,
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
  status VARCHAR(20) NOT NULL CHECK (status IN ('נקראה', 'לא נקראה')),
  createdDate DATE NOT NULL,
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
('admin'), 
('libraryAdmin'), 
('inspector'), 
('borrower');

INSERT INTO subscriptionTypes (typeName, ammountToBorrow) VALUES 
('Monthly', 4), 
('Yearly',5);

INSERT INTO libraries (libraryName, address, phone) VALUES 
('Central Library', 'fdg', '026554567'), 
('Westside Library', 'fdg', '026533907'), 
('cool Library', 'eee', '026558997'), 
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

INSERT INTO users (username, phone, email, address,isWarned, subscriptionTypeId, roleId, libraryId, passwordId) VALUES 
('Alice', '123-456-7890', 'alice@example.com', '123 Main St',FALSE, 1, 4, 1, 1),
('Bob', '987-654-3210', 'bob@example.com', '456 Elm St',FALSE, 2, 4, 2, 2),
('Charlie', '555-555-5555', 'charlie@example.com', '789 Oak St',FALSE, 1, 3, 1, 3),
('David', '222-222-2222', 'david@example.com', '321 Pine St',FALSE, 2, 4,1, 4),
('Emma', '333-333-3333', 'emma@example.com', '456 Maple St',FALSE, 1, 4, 3, 5),
('Frank', '444-444-4444', 'frank@example.com', '987 Cedar St',FALSE, 1, 2,1, 6),
('Grace', '666-666-6666', 'grace@example.com', '654 Birch St',FALSE, 2, 4, 3, 7),
('Henry', '777-777-7777', 'henry@example.com', '753 Walnut St',FALSE, 1, 3, 3, 8),
('Ivy', '888-888-8888', 'ivy@example.com', '147 Cherry St',FALSE, 1, 1, null, 9),
('Jack', '999-999-9999', 'jack@example.com', '369 Spruce St',FALSE, 2, 4, 2, 10);


INSERT INTO books (nameBook, author, numOfPages, publishingYear, summary, image, category) VALUES 
('המסע הארוך של נאן', 'לאה פריד', 200, '2020', 'Summary of Book 1', 'nahn.jpg', 'מתח'),
('המצולע', 'יונה ספיר', 300, '2019', 'Summary of Book 2', 'metsula.jpg', 'Non-Fiction'),
('הנורמלי האחרון', 'רותי קפלר', 250, '2018', 'Summary of Book 3', 'hanormali-haacharon.jpg', 'מתח'),
('שלנו את סרינה', 'רותי טננולד', 180, '2017', 'Summary of Book 4', 'shelanuatsarina.jpg', 'מתח'),
('שטח סגור', 'דבורה רוזן', 320, '2016', 'Summary of Book 5', 'shetach-sagur.jpg', 'מתח'),
('בכל עת', 'ליבי קליין', 270, '2015', 'Summary of Book 6', 'bechol-et.jpg', 'Fiction'),
('אשא עיניי', 'ליבי קליין', 230, '2014', 'Summary of Book 7', 'EsaEinay.jpg', 'Science Fiction'),
('איך לא ידעתי', 'חנה רוטנברג', 280, '2013', 'Summary of Book 8', 'howDidnotIKnow.jpg', 'Historical Fiction'),
('תיק מקסיקו', 'חיים גרינבוים', 290, '2012', 'Summary of Book 9', 'tik-mexico.jpg', 'מתח'),
('הקוקייה', 'אסתר קווין', 210, '2011', 'Summary of Book 10', 'hkukiya.jpg', 'מתח'),
('שקיעת החושך','תהילה נבו',250,'2024','ספר פנטזיה מרהיב','שקיעת החושך.jpeg','פנטזיה'),
('היא תשוב לנגן','רותי טננולד',250,'2014','ספר נוגע ללב שלוקח לתקופה','היא תשוב לנגן.jpg','היסטוריה'),
('אדום לבן','דבורי רנד',250,'2014','ספר מרגש שלא יוצא מהלב','אדום-לבן-דבורי-רנד.jpg','מתח'),
('האנשים מקצה המחנה','רות רפפופורט',362,'2000','ספר מרגש שלא יוצא מהלב','the pepple from the machane.webp','היסטוריה'),
('הילדים מקצה המחנה','רות רפפופורט',390,'2010','ספר מרגש שלא יוצא מהלב','the kids from the machane.jpg','היסטוריה'),
('שולינקה','מנוחה פוקס',400,'1990','ספר מרגש שלא יוצא מהלב','shulinka.jpg','רגש'),
('יתומה לשתי אמהות','מרים כהן',400,'1970','ספר שהוא חובה','an orfhan.jpg','שואה'),
('ישולינקה ב','מנוחה פוקס',400,'1992','ספר שהוא חובה','shulinka2.jpg','רגש'),
('אתהלך','אהרון מרגלית',402,'2000','ספר שהוא חובה','אתהלך.jpg','ביוגרפיה'),
('מה שנכון נכון','דבורי רנד',500,'2023','ספר חובה לכל זוג צעיר','מה שנכון נכון.png','עלילה');
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
(10, 130),
(11,40),
(12,87),
(13,190),
(14,38),
(15,120),
(16,90),
(17,300),
(18,290),
(19,57),
(20,148);

INSERT INTO booksInLibrary (libraryId, bookId, unitsInStock, isNew) VALUES 
(1, 1, 50, FALSE),
(1, 2, 75, TRUE),
(1, 3, 60, FALSE),
(1, 4, 40, TRUE),
(1, 5, 100, FALSE),
(3, 6, 65, TRUE),
(1, 7, 55, FALSE),
(1, 8, 80, TRUE),
(1, 9, 85, FALSE),
(1, 10, 70, TRUE),
(1,11,3,TRUE),
(1,12,4,TRUE),
(1,13,3,TRUE),
(1,14,5,TRUE),
(1,15,3,TRUE),
(1,16,3,TRUE),
(1,17,4,TRUE),
(1,18,2,FALSE),
(1,19,3,FALSE),
(1,20,3,TRUE);

INSERT INTO copyBook (bookInLibraryId, isAvailable) VALUES 
(1, true),
(2, true),
(3, true),
(4, true),
(1, true),
(6, true),
(7, true),
(8, true),
(9, true),
(10, true),
(11,true),
(12,true),
(13,true),
(14,true),
(15,true),
(16,true),
(17,true),
(18,true),
(19,true),
(20,true);


INSERT INTO borrows (copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) VALUES 
(1, 1, '2024-05-10', NULL, 'Borrowed', FALSE, TRUE),
(4, 1, '2024-05-10', '2024-06-15', 'Returned', TRUE, TRUE),
(7, 1, '2024-05-10', '2024-06-20', 'Returned', TRUE, FALSE),
(3, 1, '2024-05-10', '2024-06-20',  'Returned', FALSE, FALSE),
(5, 1, '2024-05-10', '2024-06-20',  'Returned', FALSE, FALSE),
(6, 1, '2023-06-10', '2024-06-20', 'Returned', FALSE, FALSE),
(7, 7, '2024-06-10', '2024-06-20',  'Returned', FALSE, FALSE),
(8, 1, '2023-06-10', NULL, 'Borrowed', FALSE, TRUE),
(9, 1, '2023-06-10', NULL, 'Borrowed', FALSE, TRUE),
(2, 5, '2023-06-10', NULL, 'Borrowed', FALSE, TRUE);

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

INSERT INTO messages (userId, title, body, status, createdDate, readDate) VALUES 
(1, 'Title of Message 1', 'Body of Message 1', 'נקראה', '2024-02-20', '2024-05-20'),
(1, 'Title of Message 2', 'Body of Message 2', 'לא נקראה', '2024-05-12', NULL),
(3, 'Title of Message 3', 'Body of Message 3', 'נקראה', '2024-05-20', '2024-05-25'),
(4, 'Title of Message 4', 'Body of Message 4', 'לא נקראה', '2024-05-20', NULL),
(5, 'Title of Message 5', 'Body of Message 5', 'נקראה', '2024-05-20', '2024-06-01'),
(6, 'Title of Message 6', 'Body of Message 6', 'לא נקראה', '2024-05-20', NULL),
(7, 'Title of Message 7', 'Body of Message 7', 'נקראה', '2024-05-20', '2024-06-05'),
(8, 'Title of Message 8', 'Body of Message 8', 'לא נקראה', '2024-05-20', NULL),
(9, 'Title of Message 9', 'Body of Message 9', 'נקראה', '2024-05-20', '2024-06-10'),
(10, 'Title of Message 10', 'Body of Message 10', 'לא נקראה', '2024-05-20', NULL);

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
