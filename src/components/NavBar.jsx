import React from "react";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="logo" />
      <div>
        <a href="/dashboard/association">Réseau Entreprendre</a>
        <p>Gestion des prêtes FNI</p>
      </div>
    </div>
  );
};

export default NavBar;
