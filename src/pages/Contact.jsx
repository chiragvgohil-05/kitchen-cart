import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useShop } from "../context/ShopContext";

const Contact = () => {
    const { settings } = useShop();

    return (
        <div className="bg-cream min-h-screen animate-fade-in">
            {/* Split Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100-80px)]">

                {/* Information Side */}
                <div className="bg-coffee-brown text-white p-8 lg:p-32 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="space-y-20 relative z-10">
                        <div className="space-y-8">
                            <div className="h-2 w-24 bg-accent-gold rounded-full" />
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.85]">
                                ESTABLISH <br />
                                <span className="text-accent-gold not- font-bold">TOUCH</span>
                            </h1>
                            <p className="text-white/40 font-bold text-sm tracking-wide max-w-sm leading-relaxed">
                                Looking for our products? We are here to help.
                            </p>
                        </div>

                        <div className="space-y-12">
                            <div className="flex gap-8 group/item">
                                <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-accent-gold border border-white/5 transition-all duration-500 group-hover/item:bg-accent-gold group-hover/item:text-white group-hover/item:rotate-6">
                                    <Phone size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-white/20 tracking-wide">Phone Number</p>
                                    <p className="text-2xl font-bold tracking-tighter transition-colors group-hover/item:text-accent-gold">{settings?.phone || '+91 (800) 123-4567'}</p>

                                </div>
                            </div>
                            <div className="flex gap-8 group/item">
                                <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-accent-gold border border-white/5 transition-all duration-500 group-hover/item:bg-accent-gold group-hover/item:text-white group-hover/item:rotate-6">
                                    <Mail size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-white/20 tracking-wide">Email Address</p>
                                    <p className="text-2xl font-bold tracking-tighter transition-colors group-hover/item:text-accent-gold">{settings?.email || 'support@example.com'}</p>

                                </div>
                            </div>
                            <div className="flex gap-8 group/item">
                                <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-accent-gold border border-white/5 transition-all duration-500 group-hover/item:bg-accent-gold group-hover/item:text-white group-hover/item:rotate-6">
                                    <MapPin size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-white/20 tracking-wide">Our Address</p>
                                    <p className="text-2xl font-bold tracking-tighter leading-tight transition-colors group-hover/item:text-accent-gold whitespace-pre-line">{settings?.address || '123 STREET, \nCITY, ST'}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-32 bg-white relative group">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-coffee-brown/5 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2" />
                    
                    <form className="space-y-12 max-w-lg mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <label className="text-sm font-bold tracking-wide text-coffee-brown/30 ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter John Doe"
                                className="w-full px-1 py-3 border-b-2 border-coffee-brown/5 focus:border-accent-gold focus:outline-none transition-all font-bold text-xl placeholder:text-coffee-brown/10 bg-transparent text-coffee-brown"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold tracking-wide text-coffee-brown/30 ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email@example.com"
                                className="w-full px-1 py-3 border-b-2 border-coffee-brown/5 focus:border-accent-gold focus:outline-none transition-all font-bold text-xl placeholder:text-coffee-brown/10 bg-transparent text-coffee-brown"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold tracking-wide text-coffee-brown/30 ml-1">Subject</label>
                            <div className="relative">
                                <select className="w-full px-1 py-3 border-b-2 border-coffee-brown/5 focus:border-accent-gold focus:outline-none transition-all font-bold text-xl bg-transparent text-coffee-brown appearance-none cursor-pointer">
                                    <option>Order Inquiry</option>
                                    <option>Support</option>
                                    <option>Collaboration</option>
                                    <option>Feedback</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-accent-gold">
                                    <MessageSquare size={16} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold tracking-wide text-coffee-brown/30 ml-1">Message</label>
                            <textarea
                                rows="3"
                                placeholder="How can we assist you?"
                                className="w-full px-1 py-3 border-b-2 border-coffee-brown/5 focus:border-accent-gold focus:outline-none transition-all font-bold text-xl placeholder:text-coffee-brown/10 bg-transparent text-coffee-brown resize-none"
                            />
                        </div>

                        <button className="w-full h-12 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 flex items-center justify-center gap-4 active:scale-95 group/btn">
                            SEND MESSAGE
                            <Send size={18} className="group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3 transition-transform duration-500" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;
