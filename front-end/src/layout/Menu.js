import React from "react";

import { Link } from "react-router-dom";
import "./Menu.css"

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  const dashColor = {
    color: "#30475E",
    hover: {
      color: "#121212"
    }
  }
  return (
    <nav className="navbar navbar-dark align-items-start p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text mx-3">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <ul className="nav navbar-nav text-light" id="accordionSidebar">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" style={dashColor}>
              <span className="oi oi-dashboard"/>
              <div className="link-text">&nbsp;Dashboard</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search" style={dashColor}>
              <span className="oi oi-magnifying-glass" />
              <div className="link-text">&nbsp;Search</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservations/new" style={dashColor}>
              <span className="oi oi-plus" />
              <div className="link-text">&nbsp;New Reservation</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tables/new" style={dashColor}>
              <span className="oi oi-layers" />
              <div className="link-text">&nbsp;New Table</div>
            </Link>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
