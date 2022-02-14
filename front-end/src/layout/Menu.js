import React from "react";
import { NavLink } from "react-router-dom";

import "./Menu.css"
import {
  RiDashboard2Line,
  RiSearch2Line,
  RiAddFill,
  RiAddBoxLine
} from 'react-icons/ri';

import newLogoSmallWhite from "../images/newLogoSmallWhite.png"

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

 function Menu() {

  return (
    <nav className="menu-container">
      <NavLink to="/" className="nav-logo-NavLink" >
        <img 
          src={newLogoSmallWhite} 
          alt="Periodic Tables Logo" className="menu-logo-image" 
        />
      </NavLink>
      <ul className="nav-icons-container">
        <li className="nav-item">
          <NavLink exact to="/dashboard" activeClassName="nav-item-active">
              <RiDashboard2Line className="nav-icon"/>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/search" activeClassName="nav-item-active">
              <RiSearch2Line className="nav-icon" />
          </NavLink>
        </li>
        <li className="nav-item" activeClassName="nav-item-active">
          <NavLink to="/reservations/new" >
              <RiAddFill className="nav-icon" />
          </NavLink>
        </li>
        <li className="nav-item" activeClassName="nav-item-active">
          <NavLink to="/tables/new" >
              <RiAddBoxLine className="nav-icon" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;