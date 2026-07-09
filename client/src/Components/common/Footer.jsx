import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../../assets/assets'
import logo from "../../assets/logo/logo.png"
import { IoIosMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, } from "react-icons/fa";

const Footer = () => {

  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10'>
         <div data-aos="fade-up">
          <img src={logo} alt="logo" className="rounded-xl h-16" />
          <p className='text-sm leading-6 mt-2'>BookNest is your online destination to explore thousands of books
            across various categories.</p>
           <div className="flex gap-4 mt-4">
            <a className="bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-green-600 transition">
              <FaFacebookF />
            </a>

            <a className="bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-green-600 transition">
              <FaInstagram />
            </a>

            <a className="bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-green-600 transition">
              <FaTwitter />
            </a>

            <a className="bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-green-600 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div data-aos="fade-up" data-aos-delay="100">
          <h3 className='text-lg font-semibold text-white mb-4'>Quick Links</h3>
          <ul>
            <li>
              <Link to="/" className="hover:text-green-500 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/books" className="hover:text-green-500  transition">
                Books
              </Link>
            </li>

            <li>
              <Link
                to="/categories"
                className="hover:text-green-500  transition"
              >
                Categories
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-green-500  transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-3">
            <li className="hover:text-green-400 cursor-pointer">
              Programming
            </li>

            <li className="hover:text-green-400 cursor-pointer">Fiction</li>

            <li className="hover:text-green-400 cursor-pointer">Science</li>

            <li className="hover:text-green-400 cursor-pointer">History</li>

            <li className="hover:text-green-400 cursor-pointer">Biography</li>
          </ul>
        </div>

        {/* Contact / Newsletter */}
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className='text-lg font-semibold text-white mb-4'>Contact Us</h3>
          <p className="mt-6 flex gap-2 items-center ">
            <IoLocationSharp /> Bhubaneswar, Odisha, India
          </p>
          <p className="hover:text-indigo-400 my-2 flex gap-2 items-center ">
            <IoIosMail /> support@booknest.com
          </p>
          <p className="hover:text-indigo-400 flex gap-2 items-center ">
            <FaPhoneAlt size={13} /> +91 123-456-789
          </p>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} BookBazaar. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer