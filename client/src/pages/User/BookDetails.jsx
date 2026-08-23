import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PageBanner from "../../Components/common/PageBanner";
import BookCard from "../../Components/BooksComponents/BookCard";
import { useCart } from "../../context/CartContext";

const BookDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`srv-da5eqajbc2fs738qle30/api/books/${id}`);
        const currentBook = res.data.data;
        setBook(currentBook);

        const allBooksRes = await axios.get("srv-da5eqajbc2fs738qle30/api/books");
        const allBooks = allBooksRes.data.data;

        const related = allBooks.filter(
          (b) =>
            b.category?._id === currentBook.category?._id &&
            b._id !== currentBook._id,
        );

        setRelatedBooks(related.slice(0, 4));
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading book details...
      </div>
    );
  }

  if (!book) {
    return <div className="text-center py-20 text-red-500">Book not found</div>;
  }

  return (
    <>
      <PageBanner title={book.title} subtitle="Book Details" />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <img
              src={book.image || "/placeholder.jpg"}
              alt={book.title}
              className="rounded-xl shadow-lg w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">{book.title}</h2>

            <p className="text-gray-600 mb-2">
              Author: <span className="font-medium">{book.author}</span>
            </p>

            <p className="text-gray-600 mb-4">
              Category:{" "}
              <span className="font-medium">
                {book.category?.name || "N/A"}
              </span>
            </p>

            <p className="text-amber-950 text-2xl font-bold mb-6">
              ₹ {book.price}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {book.description}
            </p>

            {book.stock > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <label className="font-medium">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border px-3 py-2 rounded w-20"
                  />
                </div>

                <button
                  onClick={() => {
                    addToCart(book._id, quantity);
                  }}
                  className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              // Not Available button  
              <div className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg">
                Not Available
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-10 text-center">Related Books</h2>

        {relatedBooks.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-8">
            {relatedBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No related books found</p>
        )}
      </section>
    </>
  );
};

export default BookDetails;