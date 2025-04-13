import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [birthdayWish, setBirthdayWish] = useState('');
  const [error, setError] = useState('');  // Added error state

  // Fetch admin data (including birthday wish) on page load
  useEffect(() => {
    const fetchAdminData = async () => {
      const username = localStorage.getItem("username");  // Use username from localStorage

      if (!username) {
        alert("You must be logged in to view your dashboard.");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/admin?username=${username}`);
        const data = await response.json();

        if (response.ok) {
          setBirthdayWish(data.birthday_wish);  // Set birthday message if it's the admin's birthday
        } else {
          setError(data.error || "Unknown error fetching data.");
          console.error("Error fetching admin data:", data);
        }
      } catch (err) {
        setError("Error fetching data from server.");
        console.error("Error fetching admin data:", err);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div className="text-center py-20 bg-gradient-to-r from-gray-200 to-gray-400 text-black">
      <h2 className="text-4xl font-bold mb-4">👩‍💼 Welcome, Admin!</h2>
      {birthdayWish && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
          <h3 className="text-2xl font-semibold">{birthdayWish}</h3>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          <h3 className="text-2xl font-semibold">{error}</h3>
        </div>
      )}
      <p className="text-lg mb-8">Choose a service to manage:</p>

      <div className="flex justify-center space-x-6">
        <button
          onClick={() => navigate('/admin/edit-packages')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
          ✏️ Edit Packages
        </button>

        {/* Add Edit Discounts Button */}
        <button
          onClick={() => navigate('/admin/discount')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
          💸 Edit Discounts
        </button>
      </div>
    </div>
  );
}
