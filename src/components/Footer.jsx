import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, Twitter, MapPin } from "lucide-react";

import logo from "/logo.png";

import { useShop } from "../context/ShopContext";

const Footer = () => {
    const { settings } = useShop();

    return (
        <footer className="bg-brand-bg/80 border-t border-brand-primary pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-4 transform hover:scale-105 transition-transform group">
                            <img src={logo} alt="SnowEra Cafe" className="h-14 w-auto object-contain" />
                            <span className="text-3xl font-black tracking-tighter text-brand-primary group-hover:text-brand-accent transition-colors uppercase italic">
                                SnowEra <span className="text-brand-accent not-italic">Cafe</span>
                            </span>
                        </Link>
                        <p className="text-brand-primary/40 text-[13px] leading-relaxed max-w-sm font-medium">
                            The ultimate destination for premium coffee and artisanal treats. SnowEra Cafe brings the finest beans and modern coffee culture to your cup, ensuring every sip is a masterpiece.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-brand-primary">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm font-bold tracking-tight">{settings?.phone || '+91 (800) 123-4567'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-brand-primary">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm font-bold tracking-tight">{settings?.email || 'hello@snoweracafe.com'}</span>
                            </div>
                            {settings?.address && (
                                <div className="flex items-start gap-4 text-brand-primary">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center mt-1">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight max-w-[200px]">{settings.address}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <a href={settings?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Facebook size={20} strokeWidth={1.5} />
                            </a>
                            <a href={settings?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Instagram size={20} strokeWidth={1.5} />
                            </a>
                            <a href={settings?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full hover:bg-brand-primary hover:text-white transition-all">
                                <Twitter size={20} strokeWidth={1.5} />
                            </a>
                        </div>

                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-12">
                        <h3 className="text-brand-primary font-bold text-xs tracking-wide mb-8">
                            Collections
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Our Menu", href: "/menu" },
                                { name: "Offer Zone", href: "/offers" },
                                { name: "New Arrivals", href: "/new-arrivals" },
                                { name: "Search", href: "/menu" },
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
                        <h3 className="text-brand-primary font-bold text-xs tracking-wide mb-8">
                            Support & Account
                        </h3>
                        <div className="grid grid-cols-2 gap-8 lg:gap-6 text-nowrap">
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
                    <p className="text-brand-primary/30 text-sm font-bold tracking-widest">
                        &copy; {new Date().getFullYear()} SNOWERA CAFE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="#" className="text-brand-primary/30 hover:text-brand-primary text-sm font-bold tracking-widest transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-brand-primary/30 hover:text-brand-primary text-sm font-bold tracking-widest transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
