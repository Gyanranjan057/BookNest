
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserShield, FaUserCog, FaBox, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import logo from "../../assets/logo/logo.png"

import assets from "../../assets/assets.js";
import Login from "../../pages/Common/Login.jsx";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { cartCount } = useCart();

  // Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("https://booknest-r7wv.onrender.com/api/books");
      setBooks(res.data.data || []);
      setFilteredBooks(res.data.data || []);
    } catch (error) {
      console.error("BOOK ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter logic (search + category)
  useEffect(() => {
    let result = books;

    if (category !== "All") {
      result = result.filter(
        (book) =>
          book.category === category ||
          book.category?._id === category
      );
    }

    if (search.trim() !== "") {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(result);
  }, [search, category, books]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Request Admin Access
  const handleAdminRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://booknest-r7wv.onrender.com/api/auth/admin-request",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <img src={logo} alt="logo" className="h-16" />

        {/* Desktop Menu */}
       
        <ul className="hidden lg:flex space-x-8 text-green-700 font-bold text-xl">
  <li>
    <NavLink to="/" end
      className={({ isActive }) =>
        `px-3 py-1 rounded-lg transition ${isActive ? "bg-teal-600 text-white" : ""}`
      }
    >
      Home
    </NavLink>
  </li>
  <li>
    <NavLink to="/books"
      className={({ isActive }) =>
        `px-3 py-1 rounded-lg transition ${isActive ? "bg-teal-600 text-white" : ""}`
      }
    >
      Books
    </NavLink>
  </li>
  <li>
    <NavLink to="/categories"
      className={({ isActive }) =>
        `px-3 py-1 rounded-lg transition ${isActive ? "bg-teal-600 text-white" : ""}`
      }
    >
      Categories
    </NavLink>
  </li>
  <li>
    <NavLink to="/about"
      className={({ isActive }) =>
        `px-3 py-1 rounded-lg transition ${isActive ? "bg-teal-600 text-white" : ""}`
      }
    >
      About
    </NavLink>
  </li>
</ul>

        {/* Right Section */}
        <div className="hidden lg:flex items-center space-x-6">

          {/* Search */}
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/books?search=${search}`);
              }
            }}
            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-800"
          />

          {/* Cart */}
          {user && (
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-amber-950 hover:text-green-900 transition" />
              <span className="absolute -top-3 -right-4 bg-amber-950 text-white px-1.5 text-sm rounded-full">
                {cartCount}
              </span>
            </Link>
          )}

          {/* Auth */}
          {!user ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdown(!dropdown)}
                className="w-10 h-10 cursor-pointer flex items-center justify-center bg-green-600 text-white rounded-full font-bold"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {dropdown && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg border">
                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 font-serif"
                    >
                      Admin Panel
                    </button>
                  )}
                  {user.role === "user" && (
                    <div className="">
                      <button
                        title="⚠️ Admin access required. Click to request."
                        onClick={() => handleAdminRequest()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Admin
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-serif"
                  >
                    Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 font-serif text-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Right Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-lg transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >

            <div className="flex justify-between">
              <button onClick={() => setMenuOpen(false)}>
                <FaTimes className="text-black text-xl cursor-pointer" />
              </button>
            </div>

            {/* Account Section */}
            {user && (<div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center border rounded-lg">
                  👤
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                </div>
              </div>
            </div>
            )}

            {/* Menu */}
            <ul className="flex flex-col mt-6 space-y-6 text-black text-lg font-medium">

              {user?.role === "user" && (
                <button
                  title="⚠️ Admin access required. Click to request."
                  onClick={() => {
                    handleAdminRequest();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left cursor-pointer"
                >
                  Request Access
                </button>
              )}

              {/* Admin Panel - top of menu for admin role */}
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left cursor-pointer"
                >
                  Admin Panel
                </button>
              )}

              <NavLink to="/" end onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-teal-600 font-bold" : ""}>Home</NavLink>
              <NavLink to="/books" onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-teal-600 font-bold" : ""}>Books</NavLink>
              <NavLink to="/categories" onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-teal-600 font-bold" : ""}>Categories</NavLink>
              <NavLink to="/about" onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-teal-600 font-bold" : ""}>About</NavLink>

              {user?.role === "user" && (
                <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
              )}
              {user?.role === "user" && (
                <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left font-bold text-xl text-red-500 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </ul>

            {/* Login button for guest */}
            {!user && (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setMenuOpen(false);
                }}
                className="text-green-600 font-bold text-xl cursor-pointer mt-4"
              >
                Login
              </button>
            )}

          </div>
        </>
      )}

      <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;