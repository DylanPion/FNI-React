import React from "react";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="outlet">
      <Outlet />
    </div>
  );
};

export default Root;
