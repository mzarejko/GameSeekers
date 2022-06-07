import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from "react"
import "../styles/Navigation.css";

const list = [
  { name: "Start", path: "/", exact: true },

  { name: "Utwórz pokój", path: "/createroom" },
  { name: "Lista pokojów", path: "/roomlist" },
  { name: "Lista gier", path: "/gamelist" },
  { name: "logowanie", path: "/login" },
]

const Navigation = () => {

  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const menu = list.map(item => (
    <li>
      <NavLink onClick={() => {
          setIsNavExpanded(false)
        }} to={item.path} exact={item.exact ? item.exact : false}>{item.name}</NavLink>
    </li>
  ))

  return (
    <nav className="navigation">
      <a onClick={() => {
          setIsNavExpanded(false)
        }} href="/" className="brand-name">
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