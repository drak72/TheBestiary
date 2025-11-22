import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useClickAway } from "@hooks/useClickAway";
import { Hamburger } from "@components/icons/Hamburger";

import "@components/AppBar/Appbar.css";

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
          data-testid="menu-toggle"
        >
          <Hamburger />
        </button>

        <div
          ref={ref}
          id="navbar-menu"
          data-testid="navbar-menu"
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