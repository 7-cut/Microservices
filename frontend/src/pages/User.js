// src/pages/User.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="text-center py-20 bg-gradient-to-r from-blue-200 to-blue-400 text-white">
        <h2 className="text-4xl font-bold mb-4">Welcome, Traveler! 🧳</h2>
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
