import React from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <SideBar />
      <NavBar />
      <div className="outlet">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
