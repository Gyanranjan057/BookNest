import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100 px-6">
      <div className="text-center">
        {/* Animated 404 */}
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-8xl md:text-9xl font-extrabold text-indigo-600 drop-shadow-lg"
        >
          404
        </motion.h1>

        {/* Floating Text */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-700 mt-4 font-semibold"
        >
          Oops! Page not found 
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mt-2"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Animated Illustration */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-10"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
            alt="Not Found"
            className="w-40 mx-auto opacity-90"
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 cursor-pointer text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-white cursor-pointer text-gray-700 px-6 py-3 rounded-xl shadow-md border hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;