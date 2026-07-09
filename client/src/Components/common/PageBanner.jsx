import React from "react";

const PageBanner = ({ title, subtitle }) => {
  return (
    <section className="bg-linear-to-r from-green-500 to-[#4f772d] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">
          {title}
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-lg opacity-90"
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PageBanner;