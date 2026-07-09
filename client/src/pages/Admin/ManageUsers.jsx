import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const API = "http://localhost:5000/api/auth";
  const currentUser = JSON.parse(localStorage.getItem("user"));

  //  Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // Update Role
  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(
        `${API}/user/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Role update failed");
    }
  };
  
  return (
    <div className="p-6 bg-linear-to-br from-gray-100 to-gray-200 min-h-screen">
       <div className="mb-8">
        <h1 className="text-2xl font-bold">👤 Manage Users</h1>
        <p className="text-gray-500 text-sm">
          View and manage all registered users
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
          >
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.isRootAdmin && (
                  <span className="text-xs text-green-600 font-bold">Root Admin</span>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="text-xs text-gray-500">Role</label>

              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                disabled={user.isRootAdmin || !currentUser?.isRootAdmin}
                className="w-full mt-1 p-2 bg-gray-100 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleDelete(user._id)}
              disabled={user.isRootAdmin}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTrash /> Delete User
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No users found</div>
      )}
    </div>
  );
};

export default ManageUsers;