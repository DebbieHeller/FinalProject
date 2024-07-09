const express = require("express");
const multer = require("multer");
const booksRouter = express.Router();
const { getSingle, create, update, deleteB } = require("../controllers/booksController");
const roleAuthorization = require("../middlewares/roleAuthorization");
const jwtAuthentication = require("../middlewares/jwtAuthentication");
booksRouter.use(express.json());

// booksRouter.get("/:bookId", async (req, res) => {
//   try {
//     const book = await getSingle(req.params.bookId);
//     if (!book) {
//       res.status(404).send({ error: "Book not found" });
//       return;
//     }
//     res.status(200).send(book);
//   } catch (error) {
//     res.status(500).send({ error: "Failed to fetch book" });
//   }
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

booksRouter.post("/", jwtAuthentication, roleAuthorization([1, 2]), upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? req.file.filename : null;
      const response = await create(
        req.body.nameBook,
        req.body.author,
        req.body.numOfPages,
        req.body.publishingYear,
        req.body.summary,
        imageUrl,
        req.body.category
      );
      res.status(201).send(await getSingle(response));
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

booksRouter.put("/:bookId", async (req, res) => {
  try {
    await update(
      req.params.bookId,
      req.body.nameBook,
      req.body.author,
      req.body.numOfPages,
      req.body.publishingYear,
      req.body.summary,
      req.body.image,
      req.body.category
    );
    res.status(200).send(await getSingle(req.params.bookId));
  } catch (error) {
    res.status(500).send({ error: "Failed to update book" });
  }
});

booksRouter.delete("/:bookId", async (req, res) => {
  try {
    await deleteB(req.params.bookId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete book" });
  }
});

module.exports = booksRouter;
