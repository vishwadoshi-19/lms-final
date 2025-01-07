import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../server/context/AuthContext";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    publicationYear: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books/${id}`,
          {
            headers: { "x-auth-token": auth.token },
          }
        );
        setBookData(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        navigate("/");
      }
    };

    fetchBook();
  }, [id, auth.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, bookData, {
        headers: { "x-auth-token": auth.token },
      });
      navigate(`/book/${id}`);
    } catch (error) {
      console.error("Error updating book:", error);
      alert(error.response?.data?.msg || "Error updating book");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
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
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Book
          </button>
          <button
            type="button"
            onClick={() => navigate(`/book/${id}`)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook
