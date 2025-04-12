import React, { useEffect, useState } from 'react';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDob, setUserDob] = useState("2025-04-12"); // Example user DOB, set to today's date or dynamic user data
  const [discounts, setDiscounts] = useState({ discount_percent: 0, reason: "" }); // Store discount data

  useEffect(() => {
    // Fetching packages
    fetch('http://localhost:5001/packages')
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
    // Fetching discounts based on user DOB
    if (userDob) {
      fetch('http://localhost:5003/discount/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob: userDob })
      })
        .then((res) => res.json())
        .then((data) => setDiscounts(data))
        .catch((err) => console.error("Failed to fetch discounts", err));
    }
  }, [userDob]);

  useEffect(() => {
  const username = localStorage.getItem("username"); // assuming it's stored
  if (username) {
    fetch(`http://localhost:5005/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.dob) {
          setUserDob(data.dob);
        }
      })
      .catch((err) => console.error("Failed to fetch user DOB", err));
  }
}, []);

  if (loading) return <div className="p-6">Loading packages...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Available Holiday Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const { price } = pkg;
          const discount = discounts.discount_percent || 0;
          const discountedPrice = price * (1 - discount / 100);
          return (
            <div key={pkg._id} className="bg-white p-4 rounded shadow border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">{pkg.destination}</h3>
              <p><strong>Price:</strong> ${price}</p>
              <p><strong>Duration:</strong> {pkg.duration}</p>
              <p><strong>Activities:</strong> {pkg.activities.join(', ')}</p>
              <p className="text-green-600"><strong>Discount:</strong> {discount}%</p>
              <p><strong>Discounted Price:</strong> ${discountedPrice.toFixed(2)}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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