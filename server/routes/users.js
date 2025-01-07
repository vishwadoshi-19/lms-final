const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/users/borrowed-books
// @desc    Get borrowed books for the authenticated user
// @access  Private
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

    res.json(borrowedBooks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

