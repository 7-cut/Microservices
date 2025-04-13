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

function App() {
  const { user, logout } = useContext(AuthContext);
  console.log("user context:", user);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MMT Clone</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/packages" className="text-gray-600 hover:text-blue-600">Packages</Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">
                Hi, {user.username || user.role}
              </span>
              <button
                onClick={logout}
                className="text-red-500 hover:underline ml-2"
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
      </Routes>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t mt-10">
        © 2025 MakeMyTrip Clone – Built with ❤️
      </footer>
    </div>
  );
}

export default App;
