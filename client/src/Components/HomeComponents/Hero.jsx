import React from 'react'
import assets from '../../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='bg-linear-to-r from-green-50 to to-amber-100 py-16'>
      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10'>
      {/* Left Content */}
       <div data-aos="fade-right" className="md:w-1/2 w-full" >
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 leading-tight'>Discover Your Next <span>Favorite Book</span></h1>
        <p className="mt-6 text-gray-600 text-lg">Explore thousands of books across different categories. Buy, read and expand your knowledge with BookNest.</p>
        {/* CTA Buttons */}
        <div className='space-x-5 flex mt-8'>
          <Link to="/books" className='bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition '>Browse Books</Link>
          <Link to="/categories" className='border border-green-950 text-green-900 px-5 py-3 rounded-lg hover:bg-green-900 hover:text-white transition '>Explore Categories</Link>
        </div>
       </div>
      {/* Right Image */}
       <div data-aos="fade-left" className="flex justify-center md:w-1/2 w-full">
        <img src={assets.image1} alt="books"
            className="w-full rounded-xl drop-shadow-xl" /></div> 
      </div>
    </section>
  )
}

export default Hero