import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useClickAway } from "@hooks/useClickAway";
import "./css/Appbar.css";
import { Hamburger } from "./icons/Hamburger";

export const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useClickAway(() => setIsMenuOpen(false));

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <span className="navbar-title">TheBestiary.fyi</span>
        </a>

        <span className="navbar-subtitle">A generative bestiary</span>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-toggle"
          aria-controls="navbar-menu"
          aria-expanded={isMenuOpen}
        >
          <Hamburger />
        </button>

        <div
          ref={ref}
          id="navbar-menu"
          className={`navbar-menu ${isMenuOpen && "open"}`}
        >
          <ul className="nav-links">
            {[
              ['Explore', '/explore'], 
              ['Favorites', '/favorites'], 
              ['About', '/about']
            ].map(([text, href]) => (
              <li key={text}>
                <Link to={href} className="nav-item">
                  {text}
                </Link>
              </li>
            )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};