 import React from 'react'
import { Link } from "react-router-dom"

const BookCard = ({ book }) => {
   const isUnavailable = book.stock === 0

  return (
    <div
      data-aos="fade-up"
      className='bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden group'>

      <img
        src={book.image}
        alt={book.title}
        className='h-96 md:h-80 w-full object-contain group-hover:scale-105 transition duration-3'
      />

      <div className='p-4'>
        <h3 className='font-semibold text-lg mb-1'>{book.title}</h3>
        <p className='text-gray-500 text-sm mb-2'>{book.author}</p>
        <p className='text-amber-950 font-bold mb-3'>₹ {book.price}</p>

        {/*Show Not Available badge when stock = 0 */}
        {isUnavailable && (
          <div className="mb-2 text-center bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-lg">
            Not Available
          </div>
        )}

        {/*View Details always visible */}
        <Link
          to={`/books/${book._id}`}
          className='block text-center bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition'>
          View Details
        </Link>
      </div>
    </div>
  )
}

export default BookCard