import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="app-container">
      <div className="menu-routes-container">
        <div className="menu-container">
          <Menu />
        </div>
        <div className="routes-container">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;