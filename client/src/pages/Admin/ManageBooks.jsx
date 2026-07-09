import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { uploadToCloudinary } from "../../utils/cloudinary";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    author: "",
    category: "",
    description: "",
    image: null,
  });

  const API = "http://localhost:5000/api/books";

  const fetchBooks = async () => {
    const res = await axios.get(API);
    setBooks(res.data.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // REMOVED handleToggleAvailability 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const payload = {
        ...formData,
        image: imageUrl,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (isEdit) {
        await axios.put(`${API}/${selectedBookId}`, payload, config);
      } else {
        await axios.post(API, payload, config);
      }

      fetchBooks();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (book) => {
    setIsEdit(true);
    setSelectedBookId(book._id);

    setFormData({
      title: book.title,
      price: book.price,
      stock: book.stock,
      author: book.author,
      category: book.category?._id,
      description: book.description,
      image: book.image,
    });

    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      stock: "",
      author: "",
      category: "",
      description: "",
      image: null,
    });
    setIsEdit(false);
    setSelectedBookId(null);
    setIsOpenModal(false);
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-100 to-gray-200 min-h-screen">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">📚 MANAGE BOOKS</h1>

        <button
          onClick={() => {
            resetForm();
            setIsOpenModal(true);
          }}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 transition text-white px-5 py-2 rounded-lg shadow-md"
        >
          Add Book <IoMdAdd />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="font-semibold text-lg line-clamp-1">
                {book.title}
              </h2>
              <p className="text-sm text-gray-500">{book.author}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-amber-950 font-bold">₹{book.price}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {book.category?.name}
                </span>
              </div>

              {/* Availability Toggle  */}
              <div className="flex items-center mt-3 justify-between">
                <span className="text-md text-slate-700 font-semibold">Availability:</span>

                {/*  Toggle is display-only */}
                <div
                  title={book.stock === 0 ? "Out of stock — Unavailable" : "In stock — Available"}
                  className={`relative inline-flex items-center w-12 h-6 rounded-full cursor-default shrink-0 transition-colors duration-300 ${book.stock === 0
                    ? "bg-gray-400"    
                    : "bg-green-500"   
                    }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${book.stock === 0
                      ? "translate-x-1"    
                      : "translate-x-7"    
                      }`}
                  />
                </div>
              </div>

              {/*  Stock Row */}
              <div className="flex items-center mt-2 justify-between">
                <span className="text-md text-slate-700 font-semibold">Stock:</span>
                {book.stock === 0 ? (
                  // Out of stock badge 
                  <span className="text-sm font-semibold text-red-600 px-2 py-0.5 -mr-4">
                    Unavailable
                  </span>
                ) : book.stock <= 5 ? (
                  // Low stock warning
                  <span className="text-xs font-bold text-orange-500">
                    ⚠ {book.stock} left
                  </span>
                ) : (
                  // Normal stock number  
                  <span className="text-sm font-bold text-slate-800">{book.stock}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(book)}
                  className="cursor-pointer flex items-center gap-1 text-green-700 hover:text-green-900"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  className="cursor-pointer flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit Book" : "Add Book"}
              </h2>

              <button
                onClick={resetForm}
                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white p-2 rounded-full"
              >
                <IoClose />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="input border border-gray-400 rounded-md pl-1"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                className="input border border-gray-400 rounded-md pl-1"
              />
              <input
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                type="number"
                min="0"
                className="input border border-gray-400 rounded-md pl-1"
              />
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                className="input border border-gray-400 rounded-md pl-1"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input border border-gray-400 rounded-md pl-1"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={handleImageChange}
                className="input border border-gray-400 rounded-md pl-1"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="col-span-2 input border border-gray-400 rounded-md pl-1"
              />

              <button
                type="submit"
                className="cursor-pointer col-span-2 bg-linear-to-r from-green-800 to-green-400 text-white p-2 rounded-lg hover:opacity-90"
              >
                {isEdit ? "Update Book" : "Add Book"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;