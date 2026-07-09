import React from 'react'
import AllBooks from "../../Components/BooksComponents/Books"
import PageBanner from '../../Components/common/PageBanner'

const Books = () => {
  return (
    <div>
      <PageBanner
         title="Browse Books"
         subtitle="Explore thousands of books from different categories"     
      />
      <AllBooks/>
    </div>
  )
}

export default Books