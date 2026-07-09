import Navbar from "../Components/common/Navbar"
import Footer from "../Components/common/Footer"
import { Outlet } from "react-router-dom"

const UserLayout = () => {
  return (
    <>
      <Navbar/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default UserLayout