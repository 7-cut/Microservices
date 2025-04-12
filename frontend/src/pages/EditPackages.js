import React, { useEffect, useState } from 'react';

export default function EditPackages() {
  const [packages, setPackages] = useState([]);
  const [inputs, setInputs] = useState({});
  const API_URL = 'http://localhost:5001/packages';

  // Fetch packages from backend on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPackage = async () => {
    const { destination, price, duration, activities } = inputs;
    if (!destination || !price || !duration || !activities) {
      alert('All fields required!');
      return;
    }

    const newPackage = {
      destination,
      price: Number(price),
      duration: `${duration} days`,
      activities: activities.split(',').map(a => a.trim())
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackage)
      });

      if (res.ok) {
        fetchPackages(); // Refresh list after adding
        setInputs({});
      } else {
        alert("Failed to add package");
      }
    } catch (err) {
      console.error("Error adding package:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchPackages(); // Refresh list after delete
      } else {
        alert("Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Packages</h2>

      {/* Add Package Form */}
      <div className="flex flex-wrap gap-4 mb-10 items-end">
        <input
          type="text"
          placeholder="Destination"
          value={inputs.destination || ''}
          onChange={(e) => handleInputChange('destination', e.target.value)}
          className="border p-2 rounded w-1/5"
        />
        <input
          type="number"
          placeholder="Price"
          value={inputs.price || ''}
          onChange={(e) => handleInputChange('price', e.target.value)}
          className="border p-2 rounded w-1/5"
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={inputs.duration || ''}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          className="border p-2 rounded w-1/5"
        />
        <input
          type="text"
          placeholder="Activities (comma separated)"
          value={inputs.activities || ''}
          onChange={(e) => handleInputChange('activities', e.target.value)}
          className="border p-2 rounded w-1/5"
        />
        <button
          onClick={handleAddPackage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Package
        </button>
      </div>

      {/* Package Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Destination</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Activities</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map(pkg => (
                <tr key={pkg._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{pkg.destination}</td>
                  <td className="px-4 py-2 border">${pkg.price}</td>
                  <td className="px-4 py-2 border">{pkg.duration}</td>
                  <td className="px-4 py-2 border">{pkg.activities.join(', ')}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No packages available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
