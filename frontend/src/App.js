import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
import Admin from './pages/Admin';
import User from './pages/User';
import Packages from './pages/Packages';
import EditPackages from './pages/EditPackages';
import CustomizePackage from './pages/CustomizePackage';
import DiscountSettings from './pages/DiscountSettings';
import Recommendations from './pages/Recommendations';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      color: '#1f2937'
    }}>
      {/* Navbar */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2563eb'
        }}>
          MMT Clone
        </h1>
        <nav style={{
          display: 'flex',
          gap: '16px'
        }}>
          <Link
            to="/"
            style={{
              color: '#4b5563',
              textDecoration: 'none',
              ':hover': {
                color: '#2563eb'
              }
            }}
          >
            Home
          </Link>
          <Link
            to="/packages"
            style={{
              color: '#4b5563',
              textDecoration: 'none',
              ':hover': {
                color: '#2563eb'
              }
            }}
          >
            Packages
          </Link>

          {!user ? (
            <Link
              to="/login"
              style={{
                color: '#4b5563',
                textDecoration: 'none',
                ':hover': {
                  color: '#2563eb'
                }
              }}
            >
              Login
            </Link>
          ) : (
            <>
              <span style={{ color: '#4b5563' }}>
                Hi, {user.username || user.role}
              </span>
              <button
                onClick={logout}
                style={{
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  ':hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/admin/edit-packages" element={<EditPackages />} />
        <Route path="/customize/:pkgId" element={<CustomizePackage />} />
        <Route path="/admin/discount" element={<DiscountSettings />} />
        <Route path="/recommend" element={<Recommendations />} />
      </Routes>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '0.875rem',
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        marginTop: '40px'
      }}>
        © 2025 MakeMyTrip Clone – Built with ❤️
      </footer>
    </div>
  );
}

export default App;