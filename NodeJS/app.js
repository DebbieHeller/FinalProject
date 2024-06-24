const express = require("express");
const cors = require("cors");
const path = require('path')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

//require('./controllers/imageController');

const users = require("./routes/usersRoute");
// const todos = require('./routes/todosRoute')
// const posts = require('./routes/postsRoute')
// const comments = require('./routes/commentsRoute')
const login = require("./routes/loginRoute");
const books = require("./routes/booksRoute");
const comments = require("./routes/commentsRoute");
const borrows = require("./routes/borrowsRoute");
const availableBooks = require("./routes/AvailableBooksRoute");


app.use("/books", books);
app.use("/comments", comments);
app.use("/users", users);
// app.use("/todos", todos)
// app.use("/posts", posts)
// app.use("/comments", comments)
app.use("/login", login);
app.use("/borrows", borrows);
app.use("/availableBooks", availableBooks);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//להוסיף טבלת קטגוריות ולקשר אותה לתכונה קטגוריה שעשינו בטבלת ספר
