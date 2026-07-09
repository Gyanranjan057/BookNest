import React from "react";

const team = [
  {
    name: "John Smith",
    role: "Founder",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David Lee",
    role: "Developer",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const OurTeam = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-12">
        Meet Our Team
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            data-aos="zoom-in"
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-28 h-28 mx-auto rounded-full mb-4"
            />

            <h3 className="font-semibold text-lg">{member.name}</h3>

            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;