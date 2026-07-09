import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      disable: false,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return <AppRoutes />;
};

export default App