import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search, ChevronDown, ChevronRight, LayoutGrid, LogOut, Package, Settings } from "lucide-react";
import { categories } from "../data/products";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/Logo.png";

const Navbar = () => {
    const { user, logout } = useAuth();
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
        { name: "Offer Zone", href: "/offers" },
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Orders", href: "/user/orders" },
        { name: "Contact", href: "/contact" },
    ];

    const utilityLinks = [
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "FAQs", href: "/faqs" },
    ];

    return (
        <header className="bg-brand-bg/80 sticky top-0 z-50 shadow-sm border-b border-brand-primary/5 backdrop-blur-md">
            {/* Top Tier: Logo, Search, User Tools */}
            <div className="py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="shrink-0">
                            <Link to="/" className="flex items-center">
                                <img src={logo} alt="Kitchen Cart" className="h-20 md:h-12 w-auto object-contain" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex grow max-w-2xl">
                            <form onSubmit={handleSearch} className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full bg-white border border-brand-primary/5 rounded-2xl py-3 pl-11 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/20 transition-all font-medium"
                                    placeholder="Search for premium kitchen tools..."
                                />
                            </form>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {user && user.role !== 'admin' ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="sm:flex hidden items-center gap-2 p-1.5 pr-3 text-brand-primary hover:bg-white rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-primary/5 border border-brand-primary/5"
                                    >
                                        <div className="w-8 h-8 bg-brand-primary text-brand-bg rounded-xl flex items-center justify-center font-black text-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest hidden lg:block">{user.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown */}
                                    <div className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl shadow-brand-primary/10 border border-brand-primary/5 py-3 transition-all duration-300 transform origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="px-5 py-2 mb-2 border-b border-brand-primary/5">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-xs font-black text-brand-primary truncate">{user.email}</p>
                                        </div>
                                        <Link to="/user/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-brand-primary/70 hover:text-brand-accent hover:bg-brand-bg transition-all uppercase tracking-widest">
                                            <Package size={16} />
                                            My Orders
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-brand-primary/70 hover:text-brand-accent hover:bg-brand-bg transition-all uppercase tracking-widest">
                                            <User size={16} />
                                            Profile Settings
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest text-left">
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : !user ? (
                                <Link
                                    to="/login"
                                    className="p-2.5 text-brand-primary hover:bg-white rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-primary/5 hidden sm:block border border-transparent hover:border-brand-primary/5"
                                >
                                    <User className="h-6 w-6" strokeWidth={1.5} />
                                </Link>
                            ) : null}
                            <Link
                                to="/wishlist"
                                className="p-2.5 text-brand-primary hover:bg-white rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-primary/5"
                            >
                                <Heart className="h-6 w-6" strokeWidth={1.5} />
                            </Link>
                            <Link
                                to="/cart"
                                className="p-2.5 text-brand-primary hover:bg-white rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-primary/5 relative"
                            >
                                <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[9px] font-black text-white ring-2 ring-white">
                                    2
                                </span>
                            </Link>

                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2.5 text-brand-primary hover:bg-white rounded-2xl focus:outline-none transition-all"
                                >
                                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier: Navigation */}
            <nav className="hidden md:block border-t border-brand-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-10">
                            {/* Categories Dropdown */}
                            <div
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setIsCategoryOpen(true)}
                                onMouseLeave={() => setIsCategoryOpen(false)}
                            >
                                <button className={`flex items-center text-xs font-black uppercase tracking-widest gap-2 py-4 transition-all ${isCategoryOpen ? 'text-brand-accent' : 'text-brand-primary'}`}>
                                    <LayoutGrid size={16} />
                                    All Categories
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute top-full left-0 w-64 bg-white rounded-b-3xl shadow-2xl shadow-brand-primary/10 border border-brand-primary/5 py-4 transition-all duration-300 transform origin-top ${isCategoryOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'}`}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => selectCategory(cat)}
                                            className="flex items-center justify-between w-full px-6 py-3 text-xs font-bold text-brand-primary/70 hover:text-brand-accent hover:bg-brand-bg transition-all text-left uppercase tracking-widest"
                                        >
                                            {cat}
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Nav Links */}
                            <div className="flex items-center space-x-6">
                                {mainNavigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `text-sm font-semibold transition-colors hover:text-brand-accent ${isActive ? "text-brand-accent" : "text-brand-primary"
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Utility Links */}
                        <div className="flex items-center space-x-6">
                            {utilityLinks.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className="text-xs font-semibold text-gray-500 hover:text-brand-accent transition-colors"
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 transform ${isOpen ? "opacity-100 translate-y-0 visible shadow-xl" : "opacity-0 -translate-y-4 invisible pointer-events-none"
                    }`}
            >
                <div className="px-4 py-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:border-brand-primary/20 transition-all"
                            placeholder="Search for products..."
                        />
                    </form>

                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Categories</div>
                        <div className="grid grid-cols-1 gap-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => selectCategory(cat)}
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-brand-primary font-bold hover:bg-brand-bg transition-all"
                                >
                                    {cat}
                                    <ChevronRight size={18} className="text-brand-primary/20" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Navigation</div>
                        {mainNavigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive ? "bg-brand-accent/10 text-brand-accent" : "text-brand-primary hover:bg-gray-50"
                                    }`
                                }
                            >
                                {item.name}
                                <ChevronRight size={18} />
                            </NavLink>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 px-4">
                        {utilityLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-sm font-medium text-gray-500"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
