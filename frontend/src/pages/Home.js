import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(to right, #bfdbfe, #93c5fd)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Plan Your Dream Vacation ✈️
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Custom packages, discounts, and eco-friendly travel—all in one place.
        </p>
        <button
          onClick={() => navigate('/packages')}
          style={{
            backgroundColor: 'white',
            color: '#2563eb',
            padding: '8px 24px',
            borderRadius: '9999px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          Explore Now
        </button>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px'
      }}>
        {[
          { title: 'Plan a Trip', link: '/packages' },
          { title: 'Check Discounts', link: '/packages' },
          { title: 'Recommendations', link: '/recommend' },
        ].map(({ title, link }, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              ':hover': {
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#4b5563' }}>Lorem ipsum dolor sit amet, consectetur adipiscing eli</p>
            <button
              onClick={() => navigate(link)}
              style={{
                marginTop: '1rem',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                ':hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Go
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;