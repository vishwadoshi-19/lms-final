import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../server/context/AuthContext";

const AddBook = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    publicationYear: "",
    quantity: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/books", bookData, {
        headers: { "x-auth-token": auth.token },
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding book:", error);
      alert(error.response?.data?.msg || "Error adding book");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={bookData.title}
            onChange={(e) =>
              setBookData({ ...bookData, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={bookData.author}
            onChange={(e) =>
              setBookData({ ...bookData, author: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Publication Year
          </label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded"
            value={bookData.publicationYear}
            onChange={(e) =>
              setBookData({ ...bookData, publicationYear: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            required
            min="0"
            className="w-full p-2 border rounded"
            value={bookData.quantity}
            onChange={(e) =>
              setBookData({ ...bookData, quantity: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook
