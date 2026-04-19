import { ArrowRight, Star, Coffee, Clock, ShieldCheck, TrendingUp, Sparkles, MapPin, Quote, ChefHat, Camera, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { motion } from "framer-motion";

// Import new assets
import baristaCraft from "../assets/barista-craft.png";
import cafeInterior from "../assets/cafe-interior.png";

const Home = () => {
    const { products } = useShop();
    const featuredProducts = products?.slice(0, 3) || [];

    const testimonials = [
        {
            name: "Alex Rivera",
            role: "Coffee Enthusiast",
            content: "The SnowEra Cafe experience is unlike any other. The attention to detail in their brewing process is evident in every sip.",
            avatar: "https://i.pravatar.cc/150?u=alex"
        },
        {
            name: "Sarah Chen",
            role: "Food Critic",
            content: "Authentic atmosphere paired with world-class coffee. Their 'Snowy Highland Brew' is a masterpiece of flavors.",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            name: "James Wilson",
            role: "Loyal Customer",
            content: "I've been coming here for months, and the quality is consistently exceptional. The loyalty program is just the cherry on top.",
            avatar: "https://i.pravatar.cc/150?u=james"
        }
    ];

    return (
        <div className="relative overflow-hidden bg-cream text-soft-black">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="space-y-8 lg:space-y-12 relative z-10"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-coffee-brown/5 rounded-full border border-coffee-brown/10 backdrop-blur-sm">
                                <Sparkles className="text-accent-gold animate-pulse" size={14} />
                                <span className="text-sm font-bold tracking-widest text-coffee-brown/80 uppercase">A New Coffee Standard</span>
                            </div>

                            <h1 className="text-6xl lg:text-[100px] xl:text-[120px] font-black text-coffee-brown leading-[0.75] tracking-[-0.06em]">
                                PURE <br />
                                <span className="text-accent-gold italic">ESSENCE</span> <br />
                                <span className="text-coffee-brown/10 stroke-text">OF BREW</span>
                            </h1>

                            <div className="flex items-center gap-8 pl-1">
                                <div className="h-16 w-1 bg-accent-gold rounded-full" />
                                <p className="text-lg font-medium text-coffee-brown/60 max-w-md leading-relaxed">
                                    Welcome to <span className="text-coffee-brown font-bold">SnowEra Cafe</span>, where every bean tells a story of passion and precision.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                <Link
                                    to="/menu"
                                    className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-[0.2em] overflow-hidden shadow-2xl transition-all hover:scale-105"
                                >
                                    <span className="relative z-10 uppercase">Book Table</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-accent-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                </Link>
                                <Link
                                    to="/menu"
                                    className="flex items-center justify-center gap-4 px-12 py-6 border-2 border-coffee-brown/20 text-coffee-brown rounded-full font-bold text-sm tracking-[0.2em] hover:bg-coffee-brown hover:text-white transition-all transform hover:-translate-y-1 uppercase"
                                >
                                    Explore Menu
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-4/5 rounded-[60px] overflow-hidden border-[12px] border-white shadow-2xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070"
                                    alt="Premium Coffee"
                                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-coffee-brown/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute top-8 right-8 w-24 h-24 bg-accent-gold rounded-full flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-2xl animate-spin-slow">
                                    EST. 2024 • EST. 2024 •
                                </div>
                                <div className="absolute bottom-10 left-10 p-8 glass-card rounded-[32px] border border-white/30 backdrop-blur-xl translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-coffee-brown shadow-xl">
                                            <TrendingUp size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-accent-gold tracking-widest uppercase mb-1">Today's Choice</p>
                                            <h3 className="font-black text-coffee-brown text-xl lg:text-2xl tracking-tighter">Snowy Highland Brew</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-20 bg-white/50 backdrop-blur-md relative z-20 border-y border-coffee-brown/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
                    {[
                        { icon: Coffee, title: "EXPERT BARISTAS", desc: "Masterfully crafted brews" },
                        { icon: Clock, title: "FRESHLY ROASTED", desc: "Daily roasted small batches" },
                        { icon: MapPin, title: "PREMIUM LOCATION", desc: "Serene ambient spaces" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="flex items-center gap-8 group"
                        >
                            <div className="w-20 h-20 bg-coffee-brown rounded-3xl shadow-xl flex items-center justify-center text-accent-gold group-hover:bg-accent-gold group-hover:text-coffee-brown transition-all duration-500 transform group-hover:rotate-12 shrink-0">
                                <feature.icon size={32} strokeWidth={1} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-coffee-brown tracking-widest mb-2 uppercase">{feature.title}</h4>
                                <p className="text-sm font-medium text-coffee-brown/50 leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Our Craft Section (New) */}
            <section className="py-24 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                                <img src={baristaCraft} alt="Expert Craft" className="w-full h-auto" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent-gold rounded-full flex flex-col items-center justify-center text-white border-8 border-cream shadow-2xl z-20">
                                <ChefHat size={40} className="mb-2" />
                                <span className="font-black text-xs tracking-widest uppercase">Expert Hands</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 order-1 lg:order-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-12 bg-accent-gold" />
                                <span className="text-xs font-black tracking-[0.5em] text-accent-gold uppercase">Our Journey</span>
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black text-coffee-brown leading-none tracking-tight">
                                CRAFTING THE <br /> PERFECT <br /> <span className="italic text-accent-gold">SYMPHONY.</span>
                            </h2>
                            <p className="text-lg text-coffee-brown/60 leading-relaxed max-w-xl">
                                At SnowEra, we believe coffee is more than just a drink—it's an art form. From sourcing the finest highland beans to the final delicate pour, every step is a testament to our dedication to excellence.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div>
                                    <h4 className="text-3xl font-black text-coffee-brown mb-1">100%</h4>
                                    <p className="text-xs font-bold text-coffee-brown/40 tracking-widest uppercase uppercase">Organic Beans</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-coffee-brown mb-1">12+</h4>
                                    <p className="text-xs font-bold text-coffee-brown/40 tracking-widest uppercase">Signature Brews</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Collection Section */}
            <section className="py-24 lg:py-32 bg-soft-black/5">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col items-center mb-20 space-y-6">
                        <div className="h-1.5 w-24 bg-accent-gold rounded-full" />
                        <h2 className="text-4xl md:text-6xl font-black text-coffee-brown tracking-tighter text-center leading-[0.85] uppercase">
                            OUR <br />
                            <span className="text-accent-gold">COLLECTIONS</span>
                        </h2>
                        <p className="text-xs font-black text-coffee-brown/30 tracking-[0.6em] text-center uppercase">Curated Excellence</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(prod => (
                                <ProductCard key={prod._id} product={prod} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border border-dashed border-coffee-brown/20 italic text-coffee-brown/40 font-bold">
                                Initializing our signature collection...
                            </div>
                        )}
                    </div>

                    <div className="mt-20 text-center">
                        <Link to="/menu" className="group inline-flex items-center gap-6 px-10 py-5 bg-white border border-coffee-brown/10 rounded-full text-xs font-black text-coffee-brown tracking-[0.3em] hover:bg-coffee-brown hover:text-white transition-all shadow-xl uppercase">
                            View Full Gallery
                            <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform duration-500 text-accent-gold" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Experience atmosphere Section (New) */}
            <section className="relative py-32 lg:py-48 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={cafeInterior} alt="Cafe Atmosphere" className="w-full h-full object-cover scale-105" />
                    <div className="absolute inset-0 bg-coffee-brown/70 backdrop-blur-[2px]" />
                </div>

                <div className="container mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
                        >
                            <Camera className="text-white" size={40} />
                        </motion.div>
                        <h2 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tight">
                            A SPACE FOR <br /> <span className="text-accent-gold italic">CONNECTION.</span>
                        </h2>
                        <p className="text-xl text-white/70 font-medium leading-relaxed max-w-2xl mx-auto">
                            Escape the noise in our carefully curated sanctuary. Whether you're here to work, meet, or simply be, SnowEra provides the perfect backdrop for your moments.
                        </p>
                        <div className="flex flex-wrap justify-center gap-12 pt-8">
                            {[
                                { icon: ShieldCheck, text: "Sustainable Sourcing" },
                                { icon: Sparkles, text: "Award Winning Design" },
                                { icon: Heart, text: "Warm Hospitality" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-white">
                                    <item.icon className="text-accent-gold" size={24} />
                                    <span className="text-sm font-black tracking-widest uppercase">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section (New) */}
            <section className="py-24 lg:py-32">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col items-center mb-20 space-y-4">
                        <span className="text-xs font-black tracking-[0.6em] text-accent-gold uppercase">Social Proof</span>
                        <h2 className="text-4xl lg:text-6xl font-black text-coffee-brown tracking-tight text-center uppercase">
                            CUSTOMER <span className="text-accent-gold">STORIES</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-10 bg-white rounded-[40px] shadow-2xl relative group hover:-translate-y-4 transition-all duration-500 border border-coffee-brown/5"
                            >
                                <Quote className="absolute top-8 right-8 text-accent-gold/20" size={60} />
                                <div className="flex items-center gap-4 mb-8">
                                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-4 border-cream shadow-lg" />
                                    <div>
                                        <h4 className="font-black text-coffee-brown tracking-tight mb-0.5">{t.name}</h4>
                                        <p className="text-xs font-bold text-accent-gold tracking-widest uppercase">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-lg text-coffee-brown/70 leading-relaxed italic">"{t.content}"</p>
                                <div className="flex gap-1 mt-6">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-accent-gold text-accent-gold" />)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-24 lg:pb-32 container mx-auto px-6 lg:px-8">
                <div className="relative bg-coffee-brown rounded-[60px] lg:rounded-[100px] p-16 lg:p-32 overflow-hidden text-center shadow-3xl group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')] opacity-10 scale-125 group-hover:rotate-12 transition-transform duration-[20s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex justify-center mb-8">
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20"
                            >
                                <Coffee className="text-accent-gold" size={50} strokeWidth={1} />
                            </motion.div>
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black text-white max-w-5xl mx-auto leading-[0.9] tracking-tighter">
                            JOIN THE ELITE <br /><span className="text-accent-gold italic uppercase">CIRCLE.</span>
                        </h2>
                        <p className="text-cream/50 font-bold max-w-2xl mx-auto text-sm tracking-widest leading-relaxed uppercase">
                            Experience exclusive harvests, private tasting <br />events, and member-only rewards.
                        </p>
                        <div className="pt-10">
                            <Link to="/register" className="relative inline-flex items-center gap-6 px-16 py-8 bg-accent-gold text-white rounded-full font-black text-sm tracking-[0.4em] overflow-hidden group shadow-2xl transition-all hover:scale-110">
                                <span className="relative z-10 uppercase">Register Now</span>
                                <Zap size={18} className="relative z-10 group-hover:scale-150 transition-transform duration-500 fill-white" />
                                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                            </Link>
                        </div>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-gold/10 rounded-full blur-[100px]" />
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
                </div>
            </section>
        </div>
    );
};

export default Home;

