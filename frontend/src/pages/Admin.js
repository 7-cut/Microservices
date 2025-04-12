// src/pages/Admin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 bg-gradient-to-r from-gray-200 to-gray-400 text-black">
      <h2 className="text-4xl font-bold mb-4">👩‍💼 Welcome, Admin!</h2>
      <p className="text-lg mb-8">Choose a service to manage:</p>

      <div className="flex justify-center space-x-6">
        <button
          onClick={() => navigate('/admin/edit-packages')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
          ✏️ Edit Packages
        </button>
      </div>
    </div>
  );
}
