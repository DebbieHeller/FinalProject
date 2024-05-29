CREATE DATABASE LibraryDB;
USE LibraryDB;

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
  libraryName VARCHAR(50) NOT NULL
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
  FOREIGN KEY (subscriptionTypeId) REFERENCES subscriptionTypes(id),
  FOREIGN KEY (roleId) REFERENCES roles(id),
  FOREIGN KEY (libraryId) REFERENCES libraries(id)
);

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
  libraryName VARCHAR(50) NOT NULL
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
  FOREIGN KEY (subscriptionTypeId) REFERENCES subscriptionTypes(id),
  FOREIGN KEY (roleId) REFERENCES roles(id),
  FOREIGN KEY (libraryId) REFERENCES libraries(id)
);

