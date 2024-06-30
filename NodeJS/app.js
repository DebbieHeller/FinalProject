const express = require("express");
const cors = require("cors");
const path = require('path')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

const jwtAuthentication=require('./middlewares/jwtAuthentication')
const cookiesEncryption=require('./middlewares/cookiesEncryption')

const users = require("./routes/usersRoute");
const login = require("./routes/loginRoute");
const books = require("./routes/booksRoute");
const comments = require("./routes/commentsRoute");
const borrows = require("./routes/borrowsRoute");
const availableBooks = require("./routes/availableBooksRoute");
const recommends = require("./routes/recommedBooksRoute");
const prevBorrows = require("./routes/prevBorrowsRoute");
const messages = require("./routes/messagesRoute")
const subscriptionTypes=require('./routes/subscriptionType')
const homeBooks=require('./routes/homeBooksRoute')
const signUp=require('./routes/signUpRoute')
const likes = require("./routes/likesRoute")

app.use("/homeBooks",homeBooks);
app.use("/likes", likes);

app.use(cookiesEncryption)
app.use("/login", login);
app.use("/signUp", signUp);



app.use(jwtAuthentication)
app.use("/books", books);
app.use("/comments", comments);
app.use("/users", users);
app.use("/borrows", borrows);
app.use("/availableBooks", availableBooks);
app.use("/recommends", recommends);
app.use("/prevBorrows", prevBorrows);
app.use("/messages", messages);
app.use("/subscriptionTypes",subscriptionTypes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
