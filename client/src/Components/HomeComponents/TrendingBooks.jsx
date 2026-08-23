import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import axios from "axios";

const TrendingBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://booknest-r7wv.onrender.com/api/books")
      .then((res) => setBooks(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Trending Books</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        autoplay={{ delay: 1500 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {books.map((book) => (
          <SwiperSlide key={book._id}>
            <img
              src={book.image}
              alt={book.title}
              className="rounded-lg shadow-md h-72 w-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TrendingBooks;