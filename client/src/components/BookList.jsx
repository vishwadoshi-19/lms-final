import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../server/context/AuthContext";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === "admin";

  useEffect(() => {
    

    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this book?")) {
  //     try {
  //       await axios.delete(`http://localhost:5000/api/books/${id}`, {
  //         headers: { "x-auth-token": auth.token },
  //       });
  //       setBooks(books.filter((book) => book._id !== id));
  //     } catch (error) {
  //       console.error("Error deleting book:", error);
  //     }
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>
      <div className="space-y-2">
        {books.map((book) => (
          <div
            key={book._id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p>Available: {book.quantity}</p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/book/${book._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to={`/book/edit/${book._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList
