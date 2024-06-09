const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./controllers/imageController');

// const users = require('./routes/usersRoute')
// const todos = require('./routes/todosRoute')
// const posts = require('./routes/postsRoute')
// const comments = require('./routes/commentsRoute')
// const login = require('./routes/loginRoute')
const books = require('./routes/booksRoute')
const comments = require('./routes/commentsRoute')

app.use("/books", books)
app.use("/comments",comments)
// app.use("/users", users)
// app.use("/todos", todos)
// app.use("/posts", posts)
// app.use("/comments", comments)
// app.use("/login", login)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


//להוסיף טבלת קטגוריות ולקשר אותה לתכונה קטגוריה שעשינו בטבלת ספר