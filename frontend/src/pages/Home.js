import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="text-center py-20 bg-gradient-to-r from-blue-200 to-blue-400 text-white">
        <h2 className="text-4xl font-bold mb-4">Plan Your Dream Vacation ✈️</h2>
        <p className="text-lg mb-6">Custom packages, discounts, and eco-friendly travel—all in one place.</p>
        <button
          onClick={() => navigate('/packages')}
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100"
        >
          Explore Now
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[
          { title: 'Plan a Trip', link: '/packages' },
          { title: 'Check Discounts', link: '/packages' },
          { title: 'Recommendations', link: '/packages' },
        ].map(({ title, link }, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button
              onClick={() => navigate(link)}
              className="mt-4 text-blue-600 hover:underline"
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
