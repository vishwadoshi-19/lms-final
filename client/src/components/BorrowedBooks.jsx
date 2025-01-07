import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books/borrowed-books", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setBorrowedBooks(response.data.books || []); // Ensure books is an array
        setUser(response.data.user || null); // Set user if it exists
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };
    fetchBorrowedBooks();
  }, []);

  return (
    <div>
      <h2>Borrowed Books</h2>
      {user && <p>Borrowed by: {user.name}</p>}
      <ul>
        {borrowedBooks.map((book) => (
          <li key={book._id}>
            <span>{book.title}</span>
            <span> by {book.author}</span>
            <span> Borrowed on: {book.borrowDate || "N/A"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowedBooks;
