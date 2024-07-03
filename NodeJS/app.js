const express = require("express");
const cors = require("cors");
const path = require('path')
const cookieParser = require("cookie-parser");
const app = express();

const jwtAuthentication = require('./middlewares/jwtAuthentication');
const roleAuthorization = require('./middlewares/roleAuthorization'); // Make sure this path is correct
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
const inspectorBorrows=require('./routes/inspectorBorrowsRoute')
const libraryAdmin = require('./routes/libraryAdminRoute');
const libraries = require('./routes/librariesRoute')


app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/homeBooks", homeBooks);
app.use("/likes", likes);
app.use("/login", login);
app.use("/signUp", signUp);
app.use("/comments", comments);


app.use(jwtAuthentication);
app.use("/libraryAdmin", roleAuthorization([2]), libraryAdmin);
app.use("/books", books);
app.use("/users", users);
app.use("/borrows", borrows);
app.use("/availableBooks", availableBooks);
app.use("/recommends", recommends);
app.use("/prevBorrows", prevBorrows);
app.use("/messages", messages);
app.use("/subscriptionTypes",subscriptionTypes);
app.use("/inspectorBorrows",inspectorBorrows);
app.use("/libraries", libraries);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
