const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const Borrowing = require("../models/Borrowing");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().select("-borrowedBy");
    res.json(books);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get single book
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin: Add book
router.post("/", adminAuth, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Admin: Update book
router.put("/:id", adminAuth, async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Admin: Delete book
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Borrow book
router.post("/:id/borrow", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ msg: "Book not available" });
    }

    const user = await User.findById(req.user.id);

    // Check if user already borrowed this book
    const alreadyBorrowed = user.borrowedBooks.some(
      (item) => item.book.toString() === req.params.id
    );

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ msg: "You have already borrowed this book" });
    }

    book.quantity -= 1;
    book.borrowedBy.push({ user: req.user.id });
    await book.save();

    user.borrowedBooks.push({ book: req.params.id });
    await user.save();

    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// User: Return book
router.post("/:id/return", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    const user = await User.findById(req.user.id);

    // Check if user has borrowed this book
    const borrowedBook = user.borrowedBooks.find(
      (item) => item.book.toString() === req.params.id
    );

    if (!borrowedBook) {
      return res.status(400).json({ msg: "You have not borrowed this book" });
    }

    book.quantity += 1;
    book.borrowedBy = book.borrowedBy.filter(
      (item) => item.user.toString() !== req.user.id
    );
    await book.save();

    user.borrowedBooks = user.borrowedBooks.filter(
      (item) => item.book.toString() !== req.params.id
    );
    await user.save();

    res.json(book);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Admin: Get borrowed books
router.get("/admin/borrowed", adminAuth, async (req, res) => {
  try {
    const books = await Book.find({
      "borrowedBy.0": { $exists: true },
    }).populate("borrowedBy.user", "username");
    res.json(books);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get library statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const uniqueBooks = await Book.distinct('title').length;
    const activeLoans = await Borrowing.countDocuments({ returnDate: null });
    const overdueBorrows = await Borrowing.countDocuments({
      returnDate: null,
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalBooks,
      uniqueBooks,
      activeLoans,
      overdueBorrows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all current borrowings
router.get('/borrowings', auth, async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ returnDate: null })
      .populate('book', 'title')
      .populate('user', 'name')
      .sort({ dueDate: 1 });
    
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/borrowed', auth, async (req, res) => {
  try {
    const books = await Book.find({
      'borrowedBy.user': req.user.id
    }).select('title borrowedBy');

    const userBorrowedBooks = books.map(book => {
      const borrowInfo = book.borrowedBy.find(b => b.user.toString() === req.user.id);
      return {
        _id: book._id,
        title: book.title,
        borrowDate: borrowInfo.borrowDate,
        dueDate: borrowInfo.dueDate
      };
    });

    res.json(userBorrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/borrowed-books', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('borrowedBooks.book');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const borrowedBooks = user.borrowedBooks.map(({ book, borrowDate }) => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      borrowDate: borrowDate
    }));

    res.json({ user, borrowedBooks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
