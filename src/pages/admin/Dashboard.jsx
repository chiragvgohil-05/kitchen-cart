import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Dashboard = () => {
    const stats = [
        { label: "Total Revenue", value: "$45,285", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-brand-accent", bg: "bg-brand-accent/10" },
        { label: "Active Users", value: "2,420", change: "+5.1%", trend: "up", icon: Users, color: "text-brand-accent", bg: "bg-brand-accent/10" },
        { label: "Total Orders", value: "854", change: "-2.3%", trend: "down", icon: ShoppingCart, color: "text-brand-accent", bg: "bg-brand-accent/10" },
    ];

    return (
        <div className="space-y-8 animate-fade-in text-brand-primary">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-brand-primary tracking-tighter uppercase italic">Control Hub</h1>
                    <p className="text-brand-primary/60 font-bold text-sm tracking-wide">Monitoring your kitchen's digital pulse.</p>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-brand-bg p-8 rounded-[32px] shadow-sm border border-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={24} strokeWidth={3} />
                            </div>

                        </div>
                        <div>
                            <p className="text-xs font-black text-brand-primary/30 uppercase tracking-widest">{stat.label}</p>
                            <h2 className="text-4xl font-black text-brand-primary mt-1 tracking-tighter">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-brand-bg p-8 rounded-[40px] shadow-sm border border-brand-primary/5 h-96 flex flex-col items-center justify-center text-brand-primary/10 relative overflow-hidden">
                    <TrendingUp size={64} className="mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest text-[10px] text-brand-primary/20">Metric Distribution Flow</p>
                    {/* Decorative Chart Mockup */}
                    <div className="absolute inset-x-8 bottom-12 flex items-end justify-between gap-2 h-32 pointer-events-none opacity-5">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-brand-primary rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>
                <div className="bg-brand-primary p-10 rounded-[40px] shadow-2xl shadow-brand-primary/20 text-brand-bg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4 tracking-tighter">STOCK ALERT</h3>
                        <p className="text-brand-bg/50 text-sm font-bold mb-8 leading-relaxed">Inventory depletion detected in 5 primary units. Authorization required for restock.</p>
                        <button className="w-full py-5 bg-brand-accent text-brand-primary rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-brand-accent/20 uppercase tracking-widest">
                            Initiate Restock
                        </button>
                    </div>
                    <Package size={160} className="absolute -right-12 -bottom-12 text-brand-bg/5 rotate-12" />
                </div>
            </div>
        </div>
    );
};

// Internal Import helper
const ShoppingCart = ({ size, ...props }) => <Package size={size} {...props} />;

export default Dashboard;
