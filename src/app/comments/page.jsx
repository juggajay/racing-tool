"use client";

import { useState, useEffect } from 'react';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(formatDate(new Date()));

  // Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Function to fetch comments
  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?startDate=${startDate}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch comments');
      }

      setComments(data.comments || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments on initial load and when startDate changes
  useEffect(() => {
    fetchComments();
  }, [startDate]);

  // Handle date change
  const handleDateChange = (e) => {
    setStartDate(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Racing Comments</h1>

      <div className="mb-4">
        <label className="block mb-1">Start Date (DD-Mon-YYYY):</label>
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded mr-2"
            value={startDate}
            onChange={handleDateChange}
            placeholder="e.g., 01-Mar-2025"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchComments}
          >
            Fetch Comments
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Format: DD-Mon-YYYY (e.g., 01-Mar-2025)
        </p>
      </div>

      {loading && (
        <div className="text-center p-4">
          <p>Loading comments...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No comments found for the selected date.</p>
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.author || 'Anonymous'}</p>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Unknown date'}
                  </div>
                </div>
                {comment.raceId && (
                  <div className="mt-2 text-sm text-gray-600">
                    Race ID: {comment.raceId}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}