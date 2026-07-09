import { Outlet, Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Components/AdminSide/Sidebar'
import { IoHome } from "react-icons/io5";
import { useEffect } from 'react';

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Auto redirect if role changed to user
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || storedUser.role !== "admin") {
        navigate("/");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
       <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
         <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Hello {user?.name}
          </h1>
        
          <div className="p-2 bg-gray-300 rounded-full text-gray-600 font-medium">
            <Link to="/">
              <IoHome />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;