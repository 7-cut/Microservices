import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CustomizePackage() {
  const [customizedPackage, setCustomizedPackage] = useState(null);
  const [selectedDates, setSelectedDates] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const packageData = location.state?.packageData;

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
    console.log('Customized Package:', {
      ...customizedPackage,
      selectedDates,
      selectedActivities,
    });
    alert("Package customized successfully!");
    navigate('/user');
  };

  if (error) {
    return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#2563eb'
      }}>
        Customize Package
      </h2>
      
      {customizedPackage && (
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#3b82f6',
            marginBottom: '0.5rem'
          }}>
            {customizedPackage.destination}
          </h3>
          <p><strong>Original Price:</strong> ${customizedPackage.price}</p>
          <p><strong>Duration:</strong> {customizedPackage.duration}</p>

          {/* Select Dates */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Choose your date:
            </label>
            <input
              type="date"
              value={selectedDates}
              onChange={handleDateChange}
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                padding: '8px',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Select Activities */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Choose Activities:
            </label>
            {customizedPackage.activities.map((activity) => (
              <div key={activity} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <input
                  type="checkbox"
                  value={activity}
                  checked={selectedActivities.includes(activity)}
                  onChange={handleActivityChange}
                  style={{ marginRight: '8px' }}
                />
                <span>{activity}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Confirm Customization
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomizePackage;