import React from "react";
import { NavLink, Link } from "react-router-dom";

import "./Menu.css"
import {
  RiDashboard2Line,
  RiSearch2Line,
  RiAddFill,
  RiAddBoxLine
} from 'react-icons/ri';

import { SvgIcon } from "@mui/material";
import { 
  HomeIcon,
  AddIcon,
  SearchIcon,
  TableRestaurant
} from '@mui/icons-material'

import newLogoSmallWhite from "../images/newLogoSmallWhite.png"

/**
 * Defines the menu for this appHomeIconlication.
 *
 * @returns {JSX.Element}
 */

 function Menu() {

  return (
    <nav className="menu-container">
      <Link to="/" className="nav-logo-NavLink" >
        <img 
          src={newLogoSmallWhite} 
          alt="Periodic Tables Logo" className="menu-logo-image" 
        />
      </Link>
      <ul className="nav-icons-container">
        <li>
          <NavLink exact to="/dashboard" activeClassName="nav-item">
            <RiDashboard2Line className="nav-icon"/>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/search" activeClassName="active">
            <RiSearch2Line className="nav-icon" />
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/reservations/new" activeClassName="active">
            <RiAddFill className="nav-icon" />
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/tables/new" activeClassName="active">
            <RiAddBoxLine className="nav-icon" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;