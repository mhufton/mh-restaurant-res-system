import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

import "./Menu.css"
import {
  RiDashboard2Line,
  RiSearch2Line,
  RiAddFill,
  RiAddBoxLine
} from 'react-icons/ri';
import newLogoSmallWhite from "../images/newLogoSmallWhite.png"

/**
 * Defines the menu for this appHomeIconlication.
 *
 * @returns {JSX.Element}
 */

 function Menu() {

  return (
    <nav className="menu-container">
      <Link to="/" className="nav-logo-MenuLink" >
        <p className="logo-name">PT</p>
      </Link>
      <ul className="nav-icons-container">
        <MenuLink exact to="/dashboard">
          <RiDashboard2Line className="nav-icon"/>
        </MenuLink>
        <MenuLink exact to="/search">
          <RiSearch2Line className="nav-icon" />
        </MenuLink>
        <MenuLink exact to="/reservations/new" >
          <RiAddFill className="nav-icon" />
        </MenuLink>
        <MenuLink exact to="/tables/new" >
          <RiAddBoxLine className="nav-icon" />
        </MenuLink>
       </ul>
    </nav>
  );
}

export default Menu;

function MenuLink(props) {
  const location = useLocation()
  const isActive = location.pathname === props.to;

  return (
    <li className={isActive ? "nav-item-active" : "nav-item"}>
      <NavLink {...props} />
    </li>
  )
}