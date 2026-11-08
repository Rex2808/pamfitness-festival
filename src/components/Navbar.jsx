
import { useState } from "react";

function Navbar({ festival }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOpen = festival?.status === "OPEN";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand" onClick={closeMenu}>
          <img
            src="/images/pamfitness-logo.jpg"
            alt="PAMFITNESS"
          />
        </a>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <a href="#about" onClick={closeMenu}>
            About
          </a>

          <a href="#activities" onClick={closeMenu}>
            Activities
          </a>

          <a href="#gallery" onClick={closeMenu}>
            Gallery
          </a>

          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          {isOpen && (
            <a
              href="#register"
              className="navbar-cta"
              onClick={closeMenu}
            >
              REGISTER FOR FREE
            </a>
          )}
        </nav>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
