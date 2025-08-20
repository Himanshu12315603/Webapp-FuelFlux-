import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [previousFeedback, setPreviousFeedback] = useState([]);

  //  Submit Feedback
  const handleFeedback = async () => {
    try {
      const response = await axiosInstance.post('/api/feed/feedback', {
        feedback,
      });
      console.log('Feedback saved:', response.data);
      setFeedback('');
      fetchFeedback(); // Refresh the list after submitting
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  //  Get Feedback
  const fetchFeedback = async () => {
    try {
      const response = await axiosInstance.get('/api/feed/getfeedback');
      const dataArray = response.data?.feedbackdata;
      if (Array.isArray(dataArray)) {
        setPreviousFeedback(dataArray);
      } else {
        console.warn('No feedback found');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  //  Fetch feedback when page loads
  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
          We Love to Hear Your Feedback
        </h2>
        <textarea
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button
          onClick={handleFeedback}
          className="w-full mt-4 bg-orange-400 text-white py-2 rounded-xl hover:bg-orange-500 transition"
        >
          Submit Feedback
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Your Previous Feedback
        </h3>
        {previousFeedback.length > 0 ? (
          <ul className="space-y-3">
            {previousFeedback.map((item) => (
              <li
                key={item._id}
                className="p-3 border rounded-xl bg-gray-50"
              >
                {item.feedback}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
