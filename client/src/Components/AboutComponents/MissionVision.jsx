import React from "react";

const MissionVision = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* Mission */}

        <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>

          <p className="text-gray-600">
            Our mission is to connect readers with books they love. We aim to
            build a digital platform where discovering and buying books becomes
            simple, enjoyable, and affordable.
          </p>
        </div>

        {/* Vision */}

        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>

          <p className="text-gray-600">
            Our vision is to become one of the most trusted online bookstores,
            empowering readers with knowledge and inspiration through books.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;