import React, { useEffect, useState } from 'react';

export default function EditPackages() {
  const [packages, setPackages] = useState([]);
  const [inputs, setInputs] = useState({});
  const [activities, setActivities] = useState([
    { name: '', price: '', customizable: false }
  ]);
  const API_URL = 'http://localhost:5001/packages';

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

  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = field === 'customizable' ? value.target.checked : value;
    setActivities(updated);
  };

  const addActivityField = () => {
    setActivities([...activities, { name: '', price: '', customizable: false }]);
  };

  const removeActivityField = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
  };

  const handleAddPackage = async () => {
    const { destination, price, duration, tags } = inputs;
    if (!destination || !price || !duration || !activities.length) {
      alert('All fields except tags are required!');
      return;
    }

    const newPackage = {
      destination,
      price: Number(price),
      duration: `${duration} days`,
      activities: activities.map(a => ({
        name: a.name,
        price: Number(a.price),
        customizable: a.customizable
      })),
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackage)
      });

      if (res.ok) {
        fetchPackages();
        setInputs({});
        setActivities([{ name: '', price: '', customizable: false }]);
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
        fetchPackages();
      } else {
        alert("Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Edit Packages
      </h2>

      {/* Add Package Form */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '40px',
        alignItems: 'flex-end'
      }}>
        <input
          type="text"
          placeholder="Destination"
          value={inputs.destination || ''}
          onChange={(e) => handleInputChange('destination', e.target.value)}
          style={{ border: '1px solid #d1d5db', padding: '8px', borderRadius: '4px', width: '20%' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={inputs.price || ''}
          onChange={(e) => handleInputChange('price', e.target.value)}
          style={{ border: '1px solid #d1d5db', padding: '8px', borderRadius: '4px', width: '20%' }}
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={inputs.duration || ''}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          style={{ border: '1px solid #d1d5db', padding: '8px', borderRadius: '4px', width: '20%' }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={inputs.tags || ''}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          style={{ border: '1px solid #d1d5db', padding: '8px', borderRadius: '4px', width: '20%' }}
        />

        <div style={{ width: '100%' }}>
          <h4 style={{ marginBottom: '8px' }}>Activities:</h4>
          {activities.map((activity, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Activity name"
                value={activity.name}
                onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              />
              <input
                type="number"
                placeholder="Price"
                value={activity.price}
                onChange={(e) => handleActivityChange(index, 'price', e.target.value)}
                style={{ width: '100px', padding: '8px' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="checkbox"
                  checked={activity.customizable}
                  onChange={(e) => handleActivityChange(index, 'customizable', e)}
                />
                Customizable
              </label>
              {activities.length > 1 && (
                <button onClick={() => removeActivityField(index)} style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  cursor: 'pointer'
                }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={addActivityField} style={{
            marginTop: '8px',
            padding: '6px 12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>+ Add Activity</button>
        </div>

        <button
          onClick={handleAddPackage}
          style={{
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
          Add Package
        </button>
      </div>

      {/* Package Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          minWidth: '100%',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          textAlign: 'left',
          borderCollapse: 'collapse'
        }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Destination</th>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Price</th>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Duration</th>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Activities</th>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Tags</th>
              <th style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map(pkg => (
                <tr key={pkg._id}>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>{pkg.destination}</td>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>${pkg.price}</td>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>{pkg.duration}</td>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                    {pkg.activities?.map((a) => `${a.name} ($${a.price}) ${a.customizable ? '[Customizable]' : ''}`).join(', ')}
                  </td>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                    {pkg.tags?.length ? pkg.tags.join(', ') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{
                  textAlign: 'center',
                  padding: '16px',
                  color: '#6b7280'
                }}>
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
