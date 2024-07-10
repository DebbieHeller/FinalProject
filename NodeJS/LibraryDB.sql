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
  userId INT NOT NULL,
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (userId) REFERENCES users(id)
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
  status VARCHAR(50)  CHECK (status IN ('Borrowed', 'Returned', 'Overdue', 'Overdue-Returned')),
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

INSERT INTO roles (roleName) VALUES 
('admin'), 
('libraryAdmin'), 
('inspector'), 
('borrower');

INSERT INTO subscriptionTypes (typeName, ammountToBorrow) VALUES 
('זוגי', 4), 
('משפחתי',6);

INSERT INTO libraries (libraryName, address, phone) VALUES 
('ספריית בית וגן', 'תורה ועבודה 2', '026554567'), 
('ספריית רמת שלמה', 'רמת שלמה', '026533907'), 
('ספריית רוממה', 'רוממה', '026558997'), 
('ספריית בנות אלישבע', 'הרב אלישיב 1', '026523205');

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
('אביגיל', '6435564', 'avigail@gmail.com', 'הפסגה 13',FALSE, 2, 4, 1, 1),
('בתיה', '055677856', 'b@gmail.com', 'מינץ 33',FALSE, 2, 4, 2, 2),
('גלית', '0527175433', 'galit@gmail.com', 'גבעת שאול',FALSE, 1, 3, 1, 3),
('דוד', '077234455', 'david@gmail.com', 'החידא 14',FALSE, 2, 4,1, 4),
('הילה', '0556766576', 'hilla@gmail.com', 'ברויאר 34',FALSE, 1, 4, 3, 5),
('ורדה', '0583278766', 'varda@gmail.com', 'הפסגה 12',FALSE, 1, 2,1, 6),
('זיוה', '0548443476', 'ziva@gmail.com', 'ברגמן 16',FALSE, 2, 4, 3, 7),
('חיים', '0556777432', 'chaim@gmail.com', 'חיים חביב',FALSE, 1, 3, 3, 8),
('טובה', '0524355542', 'tova@gmail.com', 'אולסוונגר 103',FALSE, 1, 1, null, 9),
('יהודה', '0584318891', 'yehuda@gmail.com', 'רמות',FALSE, 2, 4, 2, 10);


INSERT INTO books (nameBook, author, numOfPages, publishingYear, summary, image, category) VALUES 
('המסע הארוך של נאן', 'לאה פריד', 200, '2020', 'מסע בחייה של נאן', 'nahn.jpg', 'מתח'),
('המצולע', 'יונה ספיר', 300, '2019', 'גיבור הסיפור ממשיך בהרפתקאותיו', 'metsula.jpg', 'מתח'),
('הנורמלי האחרון', 'רותי קפלר', 250, '2018', 'כשכלו כל הקיצין', 'hanormali-haacharon.jpg', 'רגש'),
('שלנו את סרינה', 'רותי טננולד', 180, '2017', 'ילדה קטנה במנזר', 'shelanuatsarina.jpg', 'מתח'),
('שטח סגור', 'דבורה רוזן', 320, '2016', 'כשהקירות סוגרים עליך', 'shetach-sagur.jpg', 'מתח'),
('בכל עת', 'ליבי קליין', 270, '2015', 'תקציר111', 'bechol-et.jpg', 'Fiction'),
('אשא עיניי', 'ליבי קליין', 230, '2014', 'תקציר 222', 'EsaEinay.jpg', 'Science Fiction'),
('איך לא ידעתי', 'חנה רוטנברג', 280, '2013', 'תקציר 333', 'howDidnotIKnow.jpg', 'Historical Fiction'),
('תיק מקסיקו', 'חיים גרינבוים', 290, '2012', 'תקציר 999', 'tik-mexico.jpg', 'מתח'),
('הקוקייה', 'אסתר קווין', 210, '2011', 'תקציר 1000', 'hkukiya.jpg', 'מתח'),
('שקיעת החושך','תהילה נבו',250,'2024','ספר פנטזיה מרהיב','שקיעת החושך.jpeg','פנטזיה'),
('היא תשוב לנגן','רותי טננולד',250,'2014','ספר נוגע ללב שלוקח לתקופה','היא תשוב לנגן.jpg','היסטוריה'),
('מאין  יבוא','ליבי קליין',450,'2014','ספר מרגש שלא יוצא מהלב','meayn-yavo.jpg','רגש'),
('האנשים מקצה המחנה','רות רפפופורט',362,'2000','ספר מרגש שלא יוצא מהלב','the pepple from the machane.webp','היסטוריה'),
('הילדים מקצה המחנה','רות רפפופורט',390,'2010','ספר מרגש שלא יוצא מהלב','the kids from the machane.jpg','היסטוריה'),
('שולינקה','מנוחה פוקס',400,'1990','ספר מרגש שלא יוצא מהלב','shulinka.jpg','רגש'),
('יתומה לשתי אמהות','מרים כהן',400,'1970','ספר שהוא חובה','an orfhan.jpg','שואה'),
('שולינקה ב','מנוחה פוקס',400,'1992','ספר שהוא חובה','shulinka2.jpg','רגש'),
('אתהלך','אהרון מרגלית',402,'2000','ספר שהוא חובה','אתהלך.jpg','ביוגרפיה'),
('מה שנכון נכון','דבורי רנד',500,'2023','ספר חובה לכל זוג צעיר','מה שנכון נכון.png','עלילה'),
('חתום באש','דבורה רוזן',435,'2017','ספר מדהים לבני הנעורים','chatum-baesh.jpg','עלילה'),
('דם קר','יונה ספיר',335,'2020','ספר מדהים לבני הנעורים','dam-kar.jpg','עלילה'),
('כי אתה עמדי','ליבי קליין',399,'2022','מבוגרים לבני הנעורים','ki-ata-imadi.jpg','רגש'),
('שתול','יונה ספיר',405,'2019','ספר מדהים לבני הנעורים','shatul.jpg','עלילה'),
('טווח אפס','יונה ספיר',430,'2018','ספר מדהים לבני הנעורים','tvach-efes.jpg','עלילה'),
('אויב באדמת ידיד','יונה ספיר',445,'2014','ספר מדהים לבני הנעורים','oyev-yadid.jpg','עלילה'),
('החמישה','חיים גרינבוים',400,'2021','ספר מקצועי ועלילתי','hachamisha.jpg','עלילה');

INSERT INTO likes (bookId, userId) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5), 
(6, 6), 
(8, 8), 
(9, 9), 
(10, 10),
(11,1),
(12,2),
(13,3),
(14,4),
(15,5),
(16,6),
(17,7),
(18,8),
(19,9),
(20,10),
(21,1),
(22,2),
(23,3),
(24,4),
(25,5),
(1,6),
(26,7),
(1, 8), 
(2, 9), 
(3, 1), 
(4, 2), 
(5, 3), 
(6, 4), 
(8, 5), 
(9, 6), 
(10, 7),
(11,8),
(12,9),
(13,1),
(14,2),
(15,3),
(16,4),
(17,5),
(18,6),
(19,7),
(20,8),
(21,9),
(22,1),
(23,2),
(24,5),
(25,6),
(1,7),
(26,8),
(27,9);

INSERT INTO booksInLibrary (libraryId, bookId, unitsInStock, isNew) VALUES 
(1, 1, 2, FALSE),
(1, 2, 1, TRUE),
(1, 3, 1, FALSE),
(1, 4, 1, TRUE),
(1, 5, 1, FALSE),
(3, 6, 1, TRUE),
(1, 7, 1, FALSE),
(1, 8, 1, TRUE),
(1, 9, 1, FALSE),
(1, 10, 1, TRUE),
(1,11,1,TRUE),
(1,12,1,TRUE),
(1,13,1,TRUE),
(1,14,1,TRUE),
(1,15,1,TRUE),
(1,16,1,TRUE),
(1,17,1,TRUE),
(1,18,1,FALSE),
(1,19,1,FALSE),
(1,20,1,TRUE),
(1,21,1,TRUE),
(1,22,1,TRUE),
(1,23,1,TRUE),
(1,24,1,TRUE),
(1,25,1,TRUE),
(1,26,3,TRUE),
(1,27,1,TRUE);

INSERT INTO copyBook (bookInLibraryId, isAvailable) VALUES 
(1, false),
(2, false),
(3, true),
(4, true),
(5, true),
(1, true),
(6, true),
(7, false),
(8, false),
(9, false),
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
(20,true),
(21,true),
(22,true),
(23,true),
(24,true),
(25,true),
(26,true),
(26,true),
(26,true),
(27,true);

INSERT INTO borrows (copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) VALUES 
(1, 1, '2024-07-09', NULL, 'Borrowed', NULL, NULL),
(4, 1, '2024-05-10', '2024-06-15', 'Returned', NULL, TRUE),
(7, 1, '2024-05-10', '2024-06-20', 'Returned', NULL, TRUE),
(3, 1, '2024-05-10', '2024-06-20',  'Returned', NULL, TRUE),
(5, 1, '2024-05-10', '2024-06-20',  'Returned', NULL, TRUE),
(6, 1, '2024-06-10', '2024-06-20', 'Returned', NULL, TRUE),
(7, 7, '2024-06-10', '2024-06-20',  'Returned', NULL, TRUE),
(8, 1, '2024-06-20', NULL, 'Borrowed', NULL, NULL),
(9, 1, '2024-07-05', NULL, 'Borrowed', NULL, NULL),
(2, 5, '2024-06-10', NULL, 'Borrowed', NULL, NULL);

INSERT INTO comments (title, body, userId, bookId) VALUES 
('סופרת ותיקה', 'ספר יפה ומרגש ככ נוסטלגי', 1, 1),
('ספר מדהים', 'כ"כ הרבה רגש בספר אחד', 2, 1),
('תגובה3', 'מדהים', 3, 3),
('תגובה 4', 'מהמם', 4, 4),
('תגובה 5', 'מיוחד', 5, 5),
('תגובה 6', 'מותח מאד', 6, 6),
('תגובה 7', 'איזה ספר מקצועי', 7, 7),
('תגובה 8', 'ספר מיוחד במינו', 8, 8),
('תגובה 9', 'ספר מיוחד', 9, 9),
('תגובה 10', 'פשוט יפה', 10, 10),
('סופרת ותיקה', 'ספר יפה ומרגש ככ נוסטלגי', 1, 11),
('ספר מדהים', 'כ"כ הרבה רגש בספר אחד', 2, 12),
('תגובה3', 'מדהים', 3, 13),
('תגובה 4', 'מהמם', 4, 14),
('תגובה 5', 'מיוחד', 5, 15),
('תגובה 6', 'מותח מאד', 6, 16),
('תגובה 7', 'איזה ספר מקצועי', 7, 17),
('תגובה 8', 'ספר מיוחד במינו', 8, 18),
('תגובה 9', 'ספר מיוחד', 9, 19),
('תגובה 10', 'פשוט יפה', 10, 20),
('סופרת ותיקה', 'ספר יפה ומרגש ככ נוסטלגי', 1, 21),
('ספר מדהים', 'כ"כ הרבה רגש בספר אחד', 2, 22),
('תגובה3', 'מדהים', 3, 23),
('תגובה 4', 'מהמם', 4, 24),
('תגובה 5', 'מיוחד', 5, 25),
('תגובה 6', 'מותח מאד', 6, 26),
('תגובה 7', 'איזה ספר מקצועי', 7, 27);

INSERT INTO messages (userId, title, body, status, createdDate, readDate) VALUES 
(1, 'משתמש אחראי', 'שמנו לב שהינך אחראי ומחזי ר את כל ההשאלות בזמן', 'לא נקראה', '2024-02-20', '2024-05-20'),
(1, 'שים לב', 'הודעה מספר אחת', 'נקראה', '2024-05-12', NULL),
(3, 'שים לב', 'אאאא', 'נקראה', '2024-05-20', '2024-05-25'),
(4, 'שים לב', 'בבבב', 'לא נקראה', '2024-05-20', NULL),
(5, 'שים לב', 'הודעה2', 'נקראה', '2024-05-20', '2024-06-01'),
(6, 'שים לב', 'הודעה2', 'לא נקראה', '2024-05-20', NULL),
(7, 'שים לב', 'הודעה2', 'נקראה', '2024-05-20', '2024-06-05'),
(8, 'שים לב', 'הודעה2', 'לא נקראה', '2024-05-20', NULL),
(9, 'שים לב', 'הודעה2', 'נקראה', '2024-05-20', '2024-06-10'),
(10, 'שים לב', 'הודעה2', 'לא נקראה', '2024-05-20', NULL);