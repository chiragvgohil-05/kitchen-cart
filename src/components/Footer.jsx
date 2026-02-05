import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/Logo.png";

const Footer = () => {
    return (
        <footer className="bg-brand-bg/80 border-t border-brand-primary pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <img src={logo} alt="apnidukaan" className="h-12 w-auto object-contain" />
                        </Link>
                        <p className="text-brand-primary/80 text-sm leading-relaxed max-w-sm">
                            kitchenCart means a store where customers can feel like it is their own.
                            This feeling can only be brought in their hearts & minds by selling quality
                            products at reasonable prices, giving proper information about products,
                            and by giving genuine service.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-brand-primary">
                                <Phone size={18} className="text-brand-primary" />
                                <span className="text-sm font-bold">+91 7028007642</span>
                            </div>
                            <div className="flex items-center gap-3 text-brand-primary">
                                <Mail size={18} className="text-brand-primary" />
                                <span className="text-sm font-bold">contact@apnidukaan.com</span>
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

                    {/* Account & Orders */}
                    <div className="lg:pl-12">
                        <h3 className="text-brand-primary font-black text-sm uppercase tracking-wider mb-6">
                            Account & Orders
                        </h3>
                        <ul className="space-y-4">
                            {["Search", "My Account", "My Orders", "My Wish List", "Account Information", "Blog"].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-brand-primary/70 hover:text-brand-accent text-sm font-medium transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Information */}
                    <div>
                        <h3 className="text-brand-primary font-black text-sm uppercase tracking-wider mb-6">
                            Support and Information
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "About us",
                                "Privacy Policy",
                                "Cancellation and Refund",
                                "Contact us",
                                "Terms and Conditions",
                                "Shipping and Exchange",
                                "How Select With Friends Works"
                            ].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-brand-primary/70 hover:text-brand-accent text-sm font-medium transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-50 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-medium">
                        &copy; {new Date().getFullYear()} apnidukaan.com. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="#" className="text-gray-400 hover:text-brand-primary text-xs font-medium transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-gray-400 hover:text-brand-primary text-xs font-medium transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
