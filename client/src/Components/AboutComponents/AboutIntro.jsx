import React from "react";

const AboutIntro = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
      {/* Image */}

      <div data-aos="fade-right">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
          alt="books"
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Content */}

      <div data-aos="fade-left">
        <h2 className="text-3xl font-bold mb-6">Your Online Bookstore</h2>

        <p className="text-gray-600 mb-4">
          BookBazaar is an online platform where book lovers can explore,
          discover, and purchase books from a wide range of categories.
        </p>

        <p className="text-gray-600">
          Our mission is to make reading accessible and convenient for everyone
          by providing a seamless online bookstore experience.
        </p>
      </div>
    </section>
  );
};

export default AboutIntro;