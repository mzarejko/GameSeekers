import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from "react"
import "../styles/Navigation.css";
import { Navbar, Nav, Container } from 'react-bootstrap'

const list = [
  { name: "start", path: "/", exact: true },
  { name: "pokój", path: "/products" },
  { name: "utwórz pokój", path: "/contact" },
  { name: "lista", path: "/gamelist" },
  { name: "logowanie", path: "/admin" },
]

const Navigation = () => {

  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const menu = list.map(item => (
    <li>
      <NavLink to={item.path} exact={item.exact ? item.exact : false}>{item.name}</NavLink>
    </li>
  ))

  return (
    <nav className="navigation">
      <a href="/" className="brand-name">
        GameSeekers
      </a>
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}
      >
        {/* hamburger svg code... */}
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          {menu}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;