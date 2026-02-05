import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/Logo.png";

const Footer = () => {
    return (
        <footer className="bg-brand-bg/80 border-t border-brand-primary pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
                            <img src={logo} alt="Kitchen Cart" className="h-12 w-auto object-contain" />
                        </Link>
                        <p className="text-brand-primary/40 text-[13px] leading-relaxed max-w-sm font-medium">
                            The ultimate destination for professional-grade culinary tools. We bring craftsman-quality kitchenware to the modern home chef, ensuring every meal is a masterpiece.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-brand-primary">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm font-black tracking-tight">+91 (800) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-4 text-brand-primary">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm font-black tracking-tight uppercase">concierge@kitchencart.com</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Facebook size={20} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Instagram size={20} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Twitter size={20} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-12">
                        <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.2em] mb-8">
                            Collections
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Our Menu", href: "/menu" },
                                { name: "Offer Zone", href: "/offers" },
                                { name: "New Arrivals", href: "/new-arrivals" },
                                { name: "Search", href: "/search" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-brand-primary/50 hover:text-brand-accent text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Account */}
                    <div>
                        <h3 className="text-brand-primary font-black text-xs uppercase tracking-[0.2em] mb-8">
                            Support & Account
                        </h3>
                        <div className="grid grid-cols-2 gap-8 lg:gap-12 text-nowrap">
                            <ul className="space-y-4">
                                {[
                                    { name: "My Orders", href: "/user/orders" },
                                    { name: "Wishlist", href: "/wishlist" },
                                    { name: "Cart", href: "/cart" },
                                    { name: "Contact Us", href: "/contact" },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link to={item.href} className="text-brand-primary/50 hover:text-brand-accent text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-4">
                                {[
                                    { name: "Shipping", href: "/shipping" },
                                    { name: "Returns", href: "/returns" },
                                    { name: "FAQs", href: "/faqs" },
                                    { name: "Admin", href: "/admin" },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link to={item.href} className="text-brand-primary/50 hover:text-brand-accent text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-10 border-t border-brand-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-brand-primary/30 text-[10px] font-black uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} KITCHEN CART. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="#" className="text-brand-primary/30 hover:text-brand-primary text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-brand-primary/30 hover:text-brand-primary text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
