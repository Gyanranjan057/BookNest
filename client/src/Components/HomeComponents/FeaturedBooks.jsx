import React, { useState,useEffect } from 'react'
import axios from 'axios'
import BookCard from '../BooksComponents/BookCard'


const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-6 ">
        Featured Books
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.slice(0, 6).map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;