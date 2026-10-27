
import React, { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiGrid,
  FiMenu,
  FiX
} from "react-icons/fi";

const Navbar = ({
  onNavigate,
  currentPage,
  onLoginClick,
  onSignupClick,
  isLoggedIn,
  user,
  onLogout,
  onDashboardClick,
  onSearchClick,
  onCartClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = (user?.roles || []).map((role) =>
    typeof role === "string"
      ? role.toLowerCase()
      : role?.name?.toLowerCase()
  );

  const navItems = [
    { label: "HOME", page: "home" },
    { label: "COLLECTION", page: "collection" },
    { label: "ABOUT", page: "about" },
    { label: "CONTACT", page: "contact" }
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between py-5 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <button
          onClick={() => handleNavigate("home")}
          className="text-2xl font-bold tracking-wider"
        >
          FORMALFIT<span className="text-pink-500">.</span>
        </button>

        <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
          {navItems.map((item) => (
            <li key={item.page}>
              <button
                onClick={() => handleNavigate(item.page)}
                className={`flex flex-col items-center gap-1 hover:text-pink-500 ${currentPage === item.page
                    ? "text-black"
                    : "text-gray-600"
                  }`}
              >
                {item.label}
                <span
                  className={`h-[1.5px] bg-gray-700 transition-all ${currentPage === item.page ? "w-1/2" : "w-0"
                    }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={onSearchClick}
            aria-label="Search products"
            className="text-gray-700 hover:text-pink-500"
          >
            <FiSearch className="h-5 w-5" />
          </button>

          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onLoginClick}
                aria-label="Login"
                className="text-gray-700 hover:text-pink-500"
              >
                <FiUser className="h-5 w-5" />
              </button>
              <button
                onClick={onSignupClick}
                className="hidden md:block text-sm hover:text-pink-500"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="max-w-28 truncate text-sm text-gray-700">
                {user?.name || user?.email || "Account"}
              </span>

              {(roles.includes("admin") ||
                roles.includes("moderator") ||
                roles.includes("user")) && (
                  <button
                    onClick={onDashboardClick}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-500"
                  >
                    <FiGrid />
                    Dashboard
                  </button>
                )}

              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-black"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={onCartClick}
            aria-label="Shopping bag"
            className="relative text-gray-700 hover:text-pink-500"
          >
            <FiShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -bottom-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
              0
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-4 sm:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`text-left text-sm ${currentPage === item.page
                    ? "font-semibold text-pink-500"
                    : "text-gray-700"
                  }`}
              >
                {item.label}
              </button>
            ))}

            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-500">
                  {user?.name || user?.email || "Account"}
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDashboardClick();
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignupClick();
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
