import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Filter from '../Filter/Filter';


const SharedLayout = () => {
  return (
    <>
      <Navbar /> {/* ייבוא הנאב בר */}
      <Outlet /> {/* הצגת דפי משנה */}
      
    </>
    
  )
}

export default SharedLayout  
