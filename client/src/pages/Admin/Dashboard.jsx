import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

const Card = ({ title, value, highlight }) => (
  <div className="bg-white px-3 py-5 rounded-2xl shadow hover:shadow-lg transition w-full flex flex-col items-center justify-center">
    <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
    <p className={`text-2xl font-bold mt-2 ${highlight === "redValue" ? "text-red-500" : ""}`}>
      {value}
    </p>
  </div>
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [booksRes, ordersRes, usersRes, catRes] = await Promise.all([
        axios.get("https://booknest-r7wv.onrender.com/api/books"),
        axios.get("https://booknest-r7wv.onrender.com/api/orders/all", config),
        axios.get("https://booknest-r7wv.onrender.com/api/auth/users", config),
        axios.get("https://booknest-r7wv.onrender.com/api/categories"),
      ]);

      setBooks(booksRes.data.data);
      setOrders(ordersRes.data.data);
      setUsers(usersRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBooks = books.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalCategories = categories.length;

  // Revenue only from Delivered orders
  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  // Cancelled orders count
  const totalCancelled = orders.filter((order) => order.status === "Cancelled").length;

  const categoryMap = {};
  books.forEach((book) => {
    const name = book.category?.name || "Other";
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const statusMap = {};
  orders.forEach((order) => {
    statusMap[order.status] = (statusMap[order.status] || 0) + 1;
  });

  const orderData = Object.keys(statusMap).map((key) => ({
    name: key,
    orders: statusMap[key],
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Cards: Books, Orders, Cancelled, Users, Categories, Revenue — all equal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        <Card title="Books" value={totalBooks} />
        <Card title="Orders" value={totalOrders} />
        <Card title="Cancelled" value={totalCancelled} highlight="redValue" />
        <Card title="Users" value={totalUsers} />
        <Card title="Categories" value={totalCategories} />
        <Card title="Revenue" value={`₹${totalRevenue}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">Books by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={90} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">Order Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-5 rounded-2xl shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{order.userId?.name || "User"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Strikethrough in red for cancelled */}
              <span className={`font-semibold ${order.status === "Cancelled" ? "line-through text-red-500" : "text-indigo-600"}`}>
                ₹{order.totalPrice}
              </span>

              <span className="text-sm text-gray-600">{order.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;