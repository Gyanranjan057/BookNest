import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  //  ADDED: error state for inline validation
  const [nameError, setNameError] = useState("");

  const API = "https://booknest-r7wv.onrender.com/api/categories";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Category name is required");
      return;
    }

    setNameError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (isEdit) {
        await axios.put(`${API}/${selectedId}`, { name }, config);
      } else {
        await axios.post(API, { name }, config);
      }

       fetchCategories();
      resetForm();
    } catch (error) {
      console.error(error);
      setNameError("Something went wrong. Please try again.");
    }
  };

   const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
       fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (cat) => {
    setIsEdit(true);
    setSelectedId(cat._id);
    setName(cat.name);
    setNameError("");
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setName("");
    setNameError("");
    setIsEdit(false);
    setSelectedId(null);
    setIsOpenModal(false);
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-100 to-gray-200 min-h-screen">
       <h1 className="text-2xl text-center font-bold">MANAGE CATEGORIES</h1>

      <div className="flex justify-end mt-5 mb-8">
        <button
          onClick={() => {
            resetForm();
            setIsOpenModal(true);
          }}
          className="cursor-pointer flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg shadow-md"
        >
          ADD CATEGORY <IoMdAdd />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => handleEdit(cat)}
                className="cursor-pointer flex items-center gap-1 text-green-700 hover:text-green-900"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={() => handleDelete(cat._id)}
                className="cursor-pointer flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpenModal && (
         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit Category" : "Add Category"}
              </h2>

              <button
                onClick={resetForm}
                className="cursor-pointer bg-red-500 text-white p-2 rounded-full"
              >
                <IoClose />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  }}
                  // UPDATED: red border when error
                  className={`input w-full border rounded-md px-3 py-2 ${
                    nameError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {/* ADDED: inline error message below input */}
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              <button
                type="submit"
                className="cursor-pointer bg-linear-to-r from-green-800 to-green-400 text-white p-2 rounded-lg"
              >
                {isEdit ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;