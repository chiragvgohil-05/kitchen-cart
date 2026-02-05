import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search, Mic, ChevronDown, ChevronRight } from "lucide-react";

import logo from "../assets/Logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    const mainNavigation = [
        { name: "Offer Zone", href: "/offers" },
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Contact", href: "/contact" },
    ];

    const utilityLinks = [
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "FAQs", href: "/faqs" },
    ];

    return (
        <header className="bg-brand-bg/80 sticky top-0 z-50 shadow-sm border-b border-gray-100">
            {/* Top Tier: Logo, Search, User Tools */}
            <div className="bg-brand-bg/80 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <img src={logo} alt="apnidukaan" className="h-10 md:h-12 w-auto object-contain" />
                            </Link>
                        </div>

                        {/* Search Bar - Hidden on mobile, appearing in mobile menu if needed? 
                            Keeping it visible on desktop as per design */}
                        <div className="hidden md:flex grow max-w-2xl">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full bg-gray-100 border-none rounded-md py-2.5 pl-11 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                    placeholder="Search for products"
                                />
                            </form>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <Link
                                to="/profile"
                                className="p-2 text-brand-primary hover:bg-gray-50 rounded-full transition-colors hidden sm:block"
                            >
                                <User className="h-6 w-6" strokeWidth={1.5} />
                            </Link>
                            <Link
                                to="/wishlist"
                                className="p-2 text-brand-primary hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <Heart className="h-6 w-6" strokeWidth={1.5} />
                            </Link>
                            <Link
                                to="/cart"
                                className="p-2 text-brand-primary hover:bg-gray-50 rounded-full transition-colors relative"
                            >
                                <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white ring-2 ring-white">
                                    1
                                </span>
                            </Link>

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2 text-brand-primary hover:bg-gray-50 rounded-full focus:outline-none transition-all"
                                >
                                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier: Navigation - Hidden on mobile */}
            <nav className="hidden md:block border-t border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12">
                        <div className="flex items-center space-x-8">
                            {/* Categories Dropdown */}
                            <button className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors gap-1.5 py-3 group">
                                All Categories
                                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                            </button>

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
                        <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-brand-primary font-bold bg-brand-bg/30">
                            All Categories
                            <ChevronRight size={18} />
                        </button>
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
