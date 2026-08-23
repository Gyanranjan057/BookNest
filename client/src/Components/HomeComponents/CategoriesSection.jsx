import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://booknest-r7wv.onrender.com/api/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("CATEGORY ERROR:", error.response?.data || error.message);
    }
  };

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
    fetchCategories();
    fetchBooks();
  }, []);

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);

    const result = books.filter(
      (book) =>
        book.category === categoryId || book.category?._id === categoryId
    );

    setFilteredBooks(result);
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          BROWSE CATEGORIES
        </h2>

        {/* Categories */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">
            No categories found
          </p>
        ) : (
          <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className={`p-6 text-center rounded-lg cursor-pointer shadow-md transition ${
                  activeCategory === cat._id
                    ? "bg-green-100 text-amber-950 font-bold"
                    : "bg-white hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}

        {/*Books Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            
          </h3>

          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500">
              No books found for this category
            </p>
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white shadow-md shadow-amber-950/40 rounded-lg p-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-80 md:h-76 w-full  object-contain group-hover:scale-105 transition duration-3"
                  />
                  <h4 className="mt-2 font-bold">{book.title}</h4>
                  <p className='text-gray-500 text-sm mb-2'>{book.author}</p>
                  <p className='text-amber-950 font-bold mb-3'>₹ {book.price}</p>
                  <Link to={`/books/${book._id}`}
                        className='block text-center bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition'>
                        View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;