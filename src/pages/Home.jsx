import { ArrowRight, Star, Coffee, Clock, ShieldCheck, TrendingUp, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { motion } from "framer-motion";

const Home = () => {
    const { products } = useShop();
    const featuredProducts = products?.slice(0, 3) || [];

    return (
        <div className="relative overflow-hidden bg-cream text-soft-black animate-fade-in">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="space-y-8 lg:space-y-12 relative z-10"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-coffee-brown/5 rounded-full border border-coffee-brown/10 backdrop-blur-sm">
                                <Sparkles className="text-accent-gold animate-pulse" size={14} />
                                <span className="text-sm font-bold tracking-wide text-coffee-brown/80">A New Coffee Experience</span>
                            </div>

                            <h1 className="text-5xl lg:text-[120px] xl:text-[140px] font-bold text-coffee-brown leading-[0.8] tracking-[-0.05em]">
                                PURE <br />
                                <span className="text-accent-gold not-">ESSENCE</span> <br />
                                <span className="text-coffee-brown/20 stroke-text">OF BREW</span>
                            </h1>

                            <div className="flex items-center gap-8 pl-1">
                                <div className="h-12 w-1 bg-accent-gold rounded-full" />
                                <p className="text-lg font-bold text-coffee-brown/50 max-w-sm leading-relaxed tracking-tight">
                                    Welcome to our store, where quality meets taste.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 pt-4 lg:pt-8">
                                <Link
                                    to="/menu"
                                    className="group relative flex items-center justify-center gap-4 px-10 lg:px-14 py-5 lg:py-6 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide overflow-hidden shadow-2xl shadow-coffee-brown/20 transition-all hover:scale-105"
                                >
                                    <span className="relative z-10">BOOK YOUR TABLE</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-accent-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                </Link>
                                <Link
                                    to="/menu"
                                    className="flex items-center justify-center gap-4 px-10 lg:px-14 py-5 lg:py-6 border-2 border-coffee-brown text-coffee-brown rounded-full font-bold text-sm tracking-wide hover:bg-coffee-brown hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    EXPLORE MENU
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="relative lg:block hidden"
                        >
                            <div className="absolute -inset-20 bg-accent-gold/20 rounded-full blur-[120px] animate-pulse" />
                            <div className="relative aspect-[4/5] rounded-[80px] overflow-hidden border-[16px] border-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-1000">
                                <img
                                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070"
                                    alt="Premium Coffee"
                                    className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-coffee-brown/80 via-transparent to-transparent" />
                                <div className="absolute bottom-12 left-12 right-12 p-6 glass-card rounded-2xl border border-white/20 backdrop-blur-xl translate-y-4 opacity-0 animate-slide-up-fade" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-accent-gold rounded-3xl flex items-center justify-center text-white shadow-xl">
                                            <TrendingUp size={32} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-accent-gold tracking-wide mb-2">Today's Special</p>
                                            <h3 className="font-bold text-white text-2xl tracking-tighter">Snowy Highland Brew</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-16 lg:py-20 bg-white/40 backdrop-blur-md relative z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                    {[
                        { icon: Coffee, title: "EXPERT BARISTAS", desc: "Crafted by world-class brewers" },
                        { icon: Clock, title: "FRESHLY ROASTED", desc: "Small batches, daily roasting" },
                        { icon: MapPin, title: "PREMIUM LOCATION", desc: "Ambient spaces for work & rest" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="flex items-center gap-6 lg:gap-8 group"
                        >
                            <div className="w-20 h-12 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-coffee-brown group-hover:bg-coffee-brown group-hover:text-accent-gold transition-all duration-500 transform group-hover:rotate-6 shrink-0">
                                <feature.icon size={36} strokeWidth={1} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-coffee-brown tracking-wide mb-2">{feature.title}</h4>
                                <p className="text-sm font-bold text-coffee-brown/40 tracking-[0.1em] leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-20 lg:py-28 container mx-auto px-6 lg:px-6">
                <div className="flex flex-col items-center mb-16 lg:mb-24 space-y-6 lg:space-y-8">
                    <div className="h-1.5 w-24 bg-accent-gold rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown tracking-tighter text-center leading-[0.85]">
                        OUR <br />
                        <span className="text-accent-gold">COLLECTIONS</span>
                    </h2>
                    <p className="text-sm font-bold text-coffee-brown/30 tracking-[0.5em] text-center">Curated for the connoisseur</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map(prod => (
                        <ProductCard key={prod._id} product={prod} />
                    ))}
                </div>

                <div className="mt-16 lg:mt-24 text-center">
                    <Link to="/menu" className="group inline-flex items-center gap-4 text-xs font-bold text-coffee-brown tracking-wide hover:text-accent-gold transition-all">
                        VIEW ENTIRE GALLERY
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-10 container mx-auto px-6 lg:px-6">
                <div className="relative bg-coffee-brown rounded-[40px] lg:rounded-[80px] p-12 lg:p-32 overflow-hidden text-center shadow-[0_50px_120px_-30px_rgba(78,52,46,0.4)] group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')] opacity-10 scale-125 group-hover:rotate-12 transition-transform duration-[10s]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-black/20" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex justify-center mb-12">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-bounce">
                                <Coffee className="text-accent-gold" size={40} strokeWidth={1} />
                            </div>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold text-cream max-w-4xl mx-auto leading-none">
                            ENJOY EVERY <br /><span className="text-accent-gold not-">MOMENT.</span>
                        </h2>
                        <p className="text-cream/40 font-bold max-w-2xl mx-auto text-xs tracking-wide leading-relaxed">
                            Join our elite loyalty program and secure exclusive <br />access to limited harvests and private tasting galas.
                        </p>
                        <div className="pt-10">
                            <Link to="/register" className="relative inline-block px-16 py-7 bg-accent-gold text-white rounded-full font-bold text-sm tracking-wide overflow-hidden group shadow-2xl shadow-accent-gold/30">
                                <span className="relative z-10">JOIN THE CIRCLE</span>
                                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
