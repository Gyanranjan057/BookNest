import React,{useEffect,useState} from 'react'
import BookCard from "./BookCard"
import axios from "axios"

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("CATEGORY ERROR:", error.response?.data || error.message);
    }
  };

    
   // Fetch books
   const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
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

    useEffect(() => {
    let result = books;

    // Category filter
    if (category !== "All") {
      result = result.filter(
        (book) =>
          book.category === category ||  
          book.category?._id === category,  
      );
    }

    // Search filter
    if (search.trim() !== "") {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredBooks(result);
  }, [search, category, books]);
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
       <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-10">
         <input
          type="text"
          placeholder="Search books..."
          className="border border-gray-400 px-4 py-2 rounded-lg w-full md:w-72 focus:ring-1 focus:ring-black outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-56 focus:ring-1 focus:ring-black outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/*  Loading */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books found </p>
      ) : (
        /* Books Grid */
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AllBooks