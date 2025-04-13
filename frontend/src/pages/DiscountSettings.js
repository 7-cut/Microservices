import React, { useEffect, useState } from 'react';

export default function DiscountSettings() {
  const [months, setMonths] = useState('');
  const [discount, setDiscount] = useState('');
  const [existingDiscount, setExistingDiscount] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5003/admin/discount';

  // Fetch current discount from the backend
  const fetchDiscounts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.months) {
        setExistingDiscount(data);
        setMonths(data.months.join(',')); // Display months as a comma-separated string
        setDiscount(data.discount);
      } else {
        setExistingDiscount(null);
      }
    } catch (err) {
      console.error("Error fetching discount:", err);
      setMessage("Failed to fetch discount settings.");
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Handle saving the discount
  const handleSave = async () => {
    const monthList = months
      .split(',')
      .map(m => parseInt(m.trim()))
      .filter(m => !isNaN(m));

    const validMonths = monthList.every(m => m >= 1 && m <= 12);
    const validDiscount = discount > 0 && discount <= 100;

    if (!validMonths) {
      setMessage("Invalid months! Use numbers between 1-12.");
      return;
    }

    if (!validDiscount) {
      setMessage("Discount should be between 1% and 100%");
      return;
    }

    const payload = {
      months: monthList,
      discount: parseInt(discount)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setMessage(result.message);
      fetchDiscounts(); // refresh
      setMonths('');
      setDiscount('');
    } catch (err) {
      console.error("Error saving discount:", err);
      setMessage("Failed to save discount.");
    }
  };

  // Handle deleting the discount
  const handleDelete = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Discount deleted successfully");
        fetchDiscounts(); // Refresh after deletion
      } else {
        alert("Failed to delete discount");
      }
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Seasonal Discount Settings</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <input
          type="text"
          placeholder="Discount Months (e.g. 4,6,12)"
          value={months}
          onChange={e => setMonths(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={e => setDiscount(e.target.value)}
          className="border p-2 rounded w-1/4"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Discount
        </button>
      </div>

      {message && <p className="mb-4 text-blue-600 font-semibold">{message}</p>}

      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Current Discount:</h3>
        {existingDiscount ? (
          <div className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Months:</strong> {existingDiscount.months.join(', ')}</p>
            <p><strong>Discount:</strong> {existingDiscount.discount}%</p>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete Discount
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No seasonal discount set.</p>
        )}
      </div>
    </div>
  );
}
