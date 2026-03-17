import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Dashboard = () => {
    const stats = [
        { label: "Daily Revenue", value: "₹45,285", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-accent-gold", bg: "bg-accent-gold/10" },
        { label: "Loyal Patrons", value: "2,420", change: "+5.1%", trend: "up", icon: Users, color: "text-accent-gold", bg: "bg-accent-gold/10" },
        { label: "Brews Served", value: "854", change: "-2.3%", trend: "down", icon: ShoppingCart, color: "text-accent-gold", bg: "bg-accent-gold/10" },
    ];

    return (
        <div className="space-y-12 animate-fade-in p-2">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                        MASTER <br /><span className="text-accent-gold not-">COMMAND</span>
                    </h1>
                    <p className="text-sm font-bold text-coffee-brown/30 tracking-wide leading-relaxed">Thy oversight of the Our Store legacy performance.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-white/40 backdrop-blur-xl border border-coffee-brown/10 rounded-full text-sm font-bold tracking-wide text-coffee-brown shadow-2xl shadow-coffee-brown/5 hover:bg-white transition-all transform hover:-translate-y-1">Export Scroll</button>
                    <button className="px-6 py-3 bg-coffee-brown text-white rounded-full text-sm font-bold tracking-wide shadow-2xl shadow-coffee-brown/20 hover:bg-accent-gold transition-all transform hover:-translate-y-1">Initiate Ritual</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/40 backdrop-blur-2xl p-6 rounded-3xl border border-coffee-brown/5 hover:border-accent-gold/20 hover:shadow-[0_40px_80px_-20px_rgba(201,162,77,0.1)] transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-gold/10 transition-colors" />
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className={`p-6 rounded-xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform duration-700 shadow-inner`}>
                                <stat.icon size={28} strokeWidth={1} />
                            </div>
                            <div className={`flex items-center gap-1.5 text-[10px] font-black px-4 py-2 rounded-full backdrop-blur-md ${stat.trend === 'up' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="relative z-10 space-y-3">
                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide">{stat.label}</p>
                            <h2 className="text-3xl font-bold text-coffee-brown tracking-tighter tabular-nums leading-none">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-2xl p-8 rounded-[80px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 relative overflow-hidden flex flex-col min-h-[500px] group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-coffee-brown tracking-tighter leading-none">Sales Velocity</h3>
                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide">Curation of recent transactions</p>
                        </div>
                        <div className="flex p-2 bg-cream rounded-full border border-coffee-brown/5">
                            {['Week', 'Month', 'Year'].map(t => (
                                <button key={t} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${t === 'Month' ? 'bg-coffee-brown text-white shadow-xl shadow-coffee-brown/20' : 'text-coffee-brown/40 hover:text-coffee-brown'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-3 h-full relative group/chart">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100, 75, 85, 90, 60, 40, 70, 45, 90, 65].map((h, i) => (
                            <div key={i} className="group/bar relative flex-1 flex flex-col justify-end h-full">
                                <div 
                                    className="bg-cream rounded-full w-full group-hover/chart:opacity-40 hover:!opacity-100 hover:bg-accent-gold transition-all duration-700 shadow-inner" 
                                    style={{ height: `${h}%` }} 
                                />
                                {i % 4 === 0 && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-bold text-coffee-brown/20 tracking-widest">Store {i}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-coffee-brown p-8 rounded-[80px] text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-coffee-brown/40 group transform hover:scale-[1.02] transition-all duration-700">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/20 rounded-full -mr-40 -mt-40 blur-[120px] pointer-events-none group-hover:bg-accent-gold/30 transition-all duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <div className="w-20 h-12 bg-accent-gold rounded-xl flex items-center justify-center shadow-2xl shadow-accent-gold/20 transform group-hover:rotate-12 transition-transform duration-700">
                            <Package size={40} className="text-white" strokeWidth={1} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tighter leading-none">INVENTORY <br /><span className="text-accent-gold not-">THRESOLD</span></h3>
                            <p className="text-white/40 text-sm font-bold leading-loose tracking-wide">Five core artifacts are falling below safety coordinates. Immediate replenishment ritual advised.</p>
                        </div>
                    </div>
                    <div className="relative z-10 pt-16">
                        <button className="w-full h-12 bg-accent-gold text-white rounded-xl font-bold text-sm tracking-[0.5em] hover:bg-white hover:text-coffee-brown transition-all duration-500 shadow-2xl shadow-accent-gold/20 active:scale-95">
                            REPLENISH STORE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Import helper
const ShoppingCart = ({ size, ...props }) => <Package size={size} {...props} />;

export default Dashboard;
