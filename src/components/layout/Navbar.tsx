// src/components/layout/Navbar.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkUser = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    window.addEventListener("scroll", handleScroll);
    checkUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "List Your Coach", path: "/list-your-coach" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-dark/90 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/anderson-luxury-logo.png"
            width="130px"
            alt="anderson-luxury-logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white/80 hover:text-gold transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="px-4 py-2 border border-white/30 rounded-full text-white/80 hover:border-gold hover:text-gold transition-all text-sm"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/30 rounded-full text-white/80 hover:border-gold hover:text-gold transition-all text-sm"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-dark/95 z-40 flex flex-col md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-xl text-white/80 hover:text-gold py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="px-4 py-2 border border-white/30 rounded-full text-center text-white/80 hover:border-gold hover:text-gold transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 border border-white/30 rounded-full text-center text-white/80 hover:border-gold hover:text-gold transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
