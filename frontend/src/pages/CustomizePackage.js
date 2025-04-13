// src/pages/CustomizePackage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CustomizePackage() {
  const [customizedPackage, setCustomizedPackage] = useState(null);
  const [selectedDates, setSelectedDates] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const packageData = location.state?.packageData; // Get data passed from Packages.js

  useEffect(() => {
  if (!packageData) {
    setError("No package data available.");
  } else {
    setCustomizedPackage(packageData);
    setSelectedActivities(packageData.activities);
  }
}, [packageData]);


  const handleDateChange = (e) => {
    setSelectedDates(e.target.value);
  };

  const handleActivityChange = (e) => {
    const value = e.target.value;
    setSelectedActivities((prevActivities) =>
      prevActivities.includes(value)
        ? prevActivities.filter((activity) => activity !== value)
        : [...prevActivities, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can send the customized data to the backend or save it locally
    console.log('Customized Package:', {
      ...customizedPackage,
      selectedDates,
      selectedActivities,
    });

    // Navigate to a confirmation page or back to the homepage
    alert("Package customized successfully!");
    navigate('/user');
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Customize Package</h2>
      {customizedPackage && (
        <div>
          <h3 className="text-xl font-semibold text-blue-500 mb-2">
            {customizedPackage.destination}
          </h3>
          <p><strong>Original Price:</strong> ${customizedPackage.price}</p>
          <p><strong>Duration:</strong> {customizedPackage.duration}</p>

          {/* Select Dates */}
          <div className="mb-4">
            <label className="block mb-2">Choose your date:</label>
            <input
              type="date"
              value={selectedDates}
              onChange={handleDateChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Select Activities */}
          <div className="mb-4">
            <label className="block mb-2">Choose Activities:</label>
            {customizedPackage.activities.map((activity) => (
              <div key={activity} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={activity}
                  checked={selectedActivities.includes(activity)}
                  onChange={handleActivityChange}
                  className="mr-2"
                />
                <span>{activity}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm Customization
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomizePackage;
