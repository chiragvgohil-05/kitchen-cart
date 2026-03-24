import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search, ChevronDown, ChevronRight, LayoutGrid, LogOut, Package, Settings, Wallet, Trophy, Gift } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

import logo from "/logo.png";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { categories, cart, wishlist } = useShop();
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate("/");
    };

    const selectCategory = (cat) => {
        navigate(`/menu?category=${encodeURIComponent(cat)}`);
        setIsCategoryOpen(false);
        setIsOpen(false);
    };

    const mainNavigation = [
        { name: "Menu", href: "/menu" },
        { name: "Table Booking", href: "/book-table" },
        { name: "Loyalty", href: "/loyalty" },
        { name: "Rewards", href: "/rewards" },
        { name: "Offers", href: "/offers" },
        { name: "About Us", href: "/about" },
    ];


    return (
        <header className="bg-coffee-brown sticky top-0 z-50 shadow-2xl border-b border-white/10 backdrop-blur-md">
            {/* Top Tier: Logo, Search, User Tools */}
            <div className="py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8">
                        <div className="shrink-0">
                            <Link to="/" className="flex items-center gap-3 group">
                                <img src={logo} alt="SnowEra Cafe" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                                <span className="md:text-2xl text-xl font-black tracking-tighter text-white uppercase italic">
                                    SnowEra <span className="text-accent-gold not-italic">Cafe</span>
                                </span>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex grow max-w-xl">
                            <form onSubmit={handleSearch} className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-cream/40 group-focus-within:text-accent-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-12 text-sm text-white placeholder-cream/40 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:bg-white/10 transition-all font-medium"
                                    placeholder="Search for your favorite brew..."
                                />
                            </form>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {user && user.role !== 'admin' ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="sm:flex hidden items-center gap-2 p-1.5 pr-3 text-cream hover:bg-white/10 rounded-full transition-all border border-white/10"
                                    >
                                        <div className="w-8 h-8 bg-accent-gold text-white rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-bold tracking-widest hidden lg:block">{user.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown */}
                                    <div className={`absolute top-full right-0 mt-3 w-56 bg-coffee-brown rounded-2xl shadow-2xl border border-white/10 py-3 transition-all duration-300 transform origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="px-5 py-2 mb-2 border-b border-white/5">
                                            <p className="text-sm font-bold text-cream/40 tracking-widest">Signed in as</p>
                                            <p className="text-xs font-bold text-white truncate">{user.email}</p>
                                        </div>
                                        <Link to="/user/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-cream/70 hover:text-accent-gold hover:bg-white/5 transition-all tracking-widest">
                                            <Package size={16} />
                                            Order History
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-cream/70 hover:text-accent-gold hover:bg-white/5 transition-all tracking-widest">
                                            <User size={16} />
                                            My Profile
                                        </Link>
                                        <Link to="/loyalty" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-cream/70 hover:text-accent-gold hover:bg-white/5 transition-all tracking-widest">
                                            <Trophy size={16} />
                                            Loyalty Program
                                        </Link>
                                        <Link to="/rewards" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-cream/70 hover:text-accent-gold hover:bg-white/5 transition-all tracking-widest">
                                            <Gift size={16} />
                                            Redeem Rewards
                                        </Link>

                                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all tracking-widest text-left">
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : !user ? (
                                <Link
                                    to="/login"
                                    className="p-2.5 text-cream hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10 hidden sm:block"
                                >
                                    <User className="h-6 w-6" strokeWidth={1.5} />
                                </Link>
                            ) : null}
                            <Link
                                to="/wishlist"
                                className="p-2.5 text-cream hover:bg-white/10 rounded-full transition-all relative border border-transparent hover:border-white/10"
                            >
                                <Heart className="h-6 w-6" strokeWidth={1.5} />
                                {wishlist.length > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-[9px] font-bold text-white ring-2 ring-coffee-brown">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/cart"
                                className="p-2.5 text-cream hover:bg-white/10 rounded-full transition-all relative border border-transparent hover:border-white/10"
                            >
                                <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                                {cart.length > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-[9px] font-bold text-white ring-2 ring-coffee-brown">
                                        {cart.reduce((total, item) => total + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>

                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2.5 text-cream hover:bg-white/10 rounded-full focus:outline-none transition-all"
                                >
                                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier: Navigation */}
            <nav className="hidden md:block border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-12">
                        <div className="flex items-center space-x-12">
                            {mainNavigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent-gold py-4 border-b-2 ${isActive ? "text-accent-gold border-accent-gold" : "text-cream/70 border-transparent hover:border-accent-gold/30"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-coffee-brown border-t border-white/5 transition-all duration-300 transform shadow-2xl ${isOpen ? "opacity-100 translate-y-0 visible max-h-screen overflow-y-auto" : "opacity-0 -translate-y-4 invisible pointer-events-none max-h-0"}`}>
                <div className="px-6 py-8 flex flex-col gap-8">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-cream/40" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm text-white placeholder-cream/40 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                            placeholder="Search brews..."
                        />
                    </form>

                    {/* Mobile Menu Links */}
                    <div className="flex flex-col space-y-6 border-b border-white/10 pb-8">
                        {mainNavigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-bold text-cream hover:text-accent-gold tracking-widest uppercase transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile User Section */}
                    <div className="flex flex-col space-y-4 pt-2 pb-6">
                        {user ? (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-accent-gold text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white tracking-wide">{user.name}</p>
                                        <p className="text-xs text-cream/40 tracking-widest">{user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-sm font-bold text-cream hover:bg-white/10 transition-colors">
                                        <User size={18} className="text-accent-gold" />
                                        Profile
                                    </Link>
                                    <Link to="/user/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-sm font-bold text-cream hover:bg-white/10 transition-colors">
                                        <Package size={18} className="text-accent-gold" />
                                        Orders
                                    </Link>
                                </div>
                                <button onClick={handleLogout} className="flex items-center gap-3 p-3 mt-4 bg-red-500/10 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors w-full">
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-3 w-full py-4 bg-accent-gold text-white rounded-full font-bold tracking-widest uppercase">
                                <User size={18} />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
