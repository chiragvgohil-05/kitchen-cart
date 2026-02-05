import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact = () => {
    return (
        <div className="bg-brand-bg min-h-screen">
            {/* Split Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">

                {/* Information Side */}
                <div className="bg-brand-primary text-brand-bg p-12 lg:p-24 flex flex-col justify-between sticky top-0">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
                                Get in <br />
                                <span className="text-brand-accent italic">Touch.</span>
                            </h1>
                            <p className="text-brand-bg/60 font-medium max-w-sm">
                                Have questions about our premium tools? Our culinary experts are here to help you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent  transition-all duration-500">
                                    <Phone size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Call us</p>
                                    <p className="text-xl font-black">+91 (800) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent  transition-all duration-500">
                                    <Mail size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Email us</p>
                                    <p className="text-xl font-black">concierge@kitchencart.com</p>
                                </div>
                            </div>
                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-accent  transition-all duration-500">
                                    <MapPin size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Visit us</p>
                                    <p className="text-xl font-black">123 Culinary Drive, <br />Surat, Gujarat</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Form Side */}
                <div className="p-12 lg:p-24 bg-white">
                    <form className="space-y-8 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-0 py-4 border-b-2 border-brand-primary/5 focus:border-brand-accent focus:outline-none transition-all font-bold text-lg placeholder:text-brand-primary/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-0 py-4 border-b-2 border-brand-primary/5 focus:border-brand-accent focus:outline-none transition-all font-bold text-lg placeholder:text-brand-primary/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Subject</label>
                            <select className="w-full px-0 py-4 border-b-2 border-brand-primary/5 focus:border-brand-accent focus:outline-none transition-all font-bold text-lg bg-transparent">
                                <option>Product Inquiry</option>
                                <option>Order Support</option>
                                <option>Business Cooperation</option>
                                <option>Feedback</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Message</label>
                            <textarea
                                rows="4"
                                placeholder="How can we help you?"
                                className="w-full px-0 py-4 border-b-2 border-brand-primary/5 focus:border-brand-accent focus:outline-none transition-all font-bold text-lg placeholder:text-brand-primary/10 resize-none"
                            />
                        </div>

                        <button className="w-full py-6 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-brand-primary transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95">
                            Send Message
                            <Send size={18} />
                        </button>
                    </form>


                </div>

            </div>
        </div>
    );
};

export default Contact;
