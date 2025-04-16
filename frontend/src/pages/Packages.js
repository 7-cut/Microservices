import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDob, setUserDob] = useState("");
  const [discounts, setDiscounts] = useState({ discount_percent: 0, reason: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
      fetch(`http://localhost:5005/user/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.dob) {
            setUserDob(data.dob);
          }
        })
        .catch((err) => console.error("Failed to fetch user DOB", err));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5001/packages`)
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load packages');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userDob) {
      fetch(`http://localhost:5003/discount/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob: userDob })
      })
        .then((res) => res.json())
        .then((data) => setDiscounts(data))
        .catch((err) => console.error("Failed to fetch discounts", err));
    }
  }, [userDob]);

  const handleCustomizeClick = (pkgId) => {
    if (!isLoggedIn) {
      alert("You need to log in to customize a package.");
      navigate('/login');
    } else {
      const selectedPackage = packages.find(pkg => pkg._id === pkgId);
      navigate(`/customize/${pkgId}`, { state: { packageData: selectedPackage } });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading packages...</div>;
  if (error) return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#2563eb'
      }}>
        Available Holiday Packages
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {packages.map((pkg) => {
          const { price } = pkg;
          const discount = discounts.discount_percent || 0;
          const discountedPrice = price * (1 - discount / 100);
          return (
            <div key={pkg._id} style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#3b82f6',
                marginBottom: '0.5rem'
              }}>
                {pkg.destination}
              </h3>
              <p><strong>Price:</strong> ${price}</p>
              <p><strong>Duration:</strong> {pkg.duration}</p>
              <p><strong>Activities:</strong> {pkg.activities.join(', ')}</p>
              <p style={{ color: '#059669' }}><strong>Discount:</strong> {discount}%</p>
              <p><strong>Discounted Price:</strong> ${discountedPrice.toFixed(2)}</p>
              <button
                onClick={() => handleCustomizeClick(pkg._id)}
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
                Customize
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Packages;