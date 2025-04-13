import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();
  const [birthdayWish, setBirthdayWish] = useState('');

  // Fetch user data (including birthday wish) on page load
  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem("username");  // Assuming username is stored in localStorage

      if (!username) {
        alert("You must be logged in to view your dashboard.");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5005/user?username=${username}`);
        const data = await response.json();

        if (response.ok) {
          setBirthdayWish(data.birthday_wish);  // Set birthday message if it's the user's birthday
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <section className="text-center py-20 bg-gradient-to-r from-blue-200 to-blue-400 text-white">
        <h2 className="text-4xl font-bold mb-4">Welcome, Traveler! 🧳</h2>
        {birthdayWish && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
            <h3 className="text-2xl font-semibold">{birthdayWish}</h3>
          </div>
        )}
        <p className="text-lg mb-6">Customize your package, explore discounts, and more.</p>
        <button
          onClick={() => navigate('/packages')}
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100"
        >
          View Packages
        </button>
      </section>
    </div>
  );
}

export default User;
