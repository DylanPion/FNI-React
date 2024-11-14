import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      <ul className="side-menu">
        <li>
          <NavLink to="/dashboard/association" className="link">
            <i className="bx bxs-home"></i>Association
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/tresory" className="link">
            <i className="bx bxs-coin-stack"></i>Trésorerie
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/accounting" className="link">
            <i className="bx bxs-bank"></i>Comptabilité
          </NavLink>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <NavLink to="/logout" className="logout">
            <i className="bx bx-log-out-circle"></i>
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
