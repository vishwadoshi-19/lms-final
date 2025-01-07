import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../server/context/AuthContext';
import axios from 'axios';

const BookDetails = () => {
  // State management for book data and loading status
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get URL parameters and hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  // Check if user is admin
  const isAdmin = auth.user?.role === 'admin';

  // Fetch book details when component mounts
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`, {
          headers: { 'x-auth-token': auth.token }
        });
        setBook(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    

    fetchBookDetails();
  }, [id, auth.token]);

  // const fetchBook = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/books/${id}`);
  //     setBook(response.data);
  //   } catch (error) {
  //     console.error('Error fetching book:', error);
  //     navigate('/');
  //   }
  // };

  // Handle book borrowing
  const handleBorrow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/books/${id}/borrow`,
        {},
        { headers: { 'x-auth-token': auth.token } }
      );
      setBook(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error borrowing book');
    }
  };

  // Handle book return
  const handleReturn = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/books/${id}/return`,
        {},
        { headers: { 'x-auth-token': auth.token } }
      );
      setBook(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error returning book');
    }
  };

  // Handle book deletion
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error.response?.data || error.message);
      alert('Error deleting book. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <div className="text-xl">Book not found</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      {/* Book details section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        
        {/* Display error message if any */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Book information */}
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Author:</span> {book.author}
          </div>
          <div>
            <span className="font-semibold">Publication Year:</span> {book.publicationYear}
          </div>
          <div>
            <span className="font-semibold">Available Quantity:</span> {book.quantity}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 space-x-4">
          {/* User actions */}
          {!isAdmin && (
            <>
              <button
                onClick={handleBorrow}
                disabled={book.quantity === 0}
                className={`px-4 py-2 rounded ${
                  book.quantity === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {book.quantity === 0 ? 'Not Available' : 'Borrow'}
              </button>
              <button
                onClick={handleReturn}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Return
              </button>
            </>
          )}

          {/* Admin actions */}
          {isAdmin && (
            <>
              <Link
                to={`/book/edit/${id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </>
          )}
          
          {/* Back to home button */}
          <Link
            to="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;