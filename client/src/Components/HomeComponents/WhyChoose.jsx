import React from "react";
import { FaBook, FaTruck, FaLock, FaTags } from "react-icons/fa";

const features = [
  {
    icon: <FaBook />,
    title: "Huge Collection",
    desc: "Thousands of books available.",
  },
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    desc: "Quick delivery across India.",
  },
  {
    icon: <FaLock />,
    title: "Secure Payment",
    desc: "Safe and secure transactions.",
  },
  { icon: <FaTags />, title: "Best Prices", desc: "Affordable book prices." },
];

const WhyChoose = () => {
  return (
    <section className="bg-green-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-6">
          Why Choose BookNest
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-xl transition"
            >
              <div className="text-green-700 text-3xl mb-4">{item.icon}</div>

              <h3 className="font-semibold mb-2">{item.title}</h3>

              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;