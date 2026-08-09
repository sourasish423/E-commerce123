import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAiAssistant } from "../context/AiAssistantContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const { open: openAssistant } = useAiAssistant();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?keyword=${encodeURIComponent(keyword.trim())}` : "/");
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-700 tracking-tight shrink-0">
          FieldNote<span className="text-signal">.</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            type="text"
            placeholder="Search the catalog…"
            className="input-field rounded-r-none"
          />
          <button type="submit" className="btn-primary rounded-l-none px-4">
            Search
          </button>
        </form>

        <nav className="hidden md:flex items-center gap-6 text-nav">
          <button
            onClick={openAssistant}
            className="flex items-center gap-1.5 text-signal hover:text-ink"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4 9C4 5.68629 6.68629 3 10 3C13.3137 3 16 5.68629 16 9C16 12.3137 13.3137 15 10 15H6.5L4 17V13.6C3.37 12.66 4 11 4 9Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            Ask AI
          </button>
          <Link to="/cart" className="relative flex items-center gap-1.5 hover:text-signal">
            Cart
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-signal text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              {user.isAdmin && (
                <Link to="/admin" className="hover:text-signal">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="hover:text-signal">
                Orders
              </Link>
              <Link to="/profile" className="hover:text-signal">
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="hover:text-clay">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-signal">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2">
                Create account
              </Link>
            </div>
          )}
        </nav>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-ink mb-1.5"></div>
          <div className="w-5 h-0.5 bg-ink mb-1.5"></div>
          <div className="w-5 h-0.5 bg-ink"></div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink/10 px-4 py-4 space-y-4">
          <form onSubmit={submitSearch} className="flex">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Search the catalog…"
              className="input-field rounded-r-none"
            />
            <button type="submit" className="btn-primary rounded-l-none px-4">
              Go
            </button>
          </form>
          <div className="flex flex-col gap-3 text-nav">
            <button
              onClick={() => {
                openAssistant();
                setMenuOpen(false);
              }}
              className="text-left text-signal"
            >
              Ask AI
            </button>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({totalQty})
            </Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link to="/orders" onClick={() => setMenuOpen(false)}>
                  Orders
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button className="text-left text-clay" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
