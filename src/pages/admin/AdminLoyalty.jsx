import { useState, useEffect } from "react";
import { Users, History, Zap, Gift, Search, Filter, Trophy, Star } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminLoyalty = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await api.get("/loyalty/all");
            setTransactions(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch loyalty history");
        } finally {
            setLoading(false);
        }
    };

    const filtered = transactions.filter(t => {
        const matchesSearch = t.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-coffee-brown tracking-tighter">Loyalty Program Stats</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Track customer points, redemptions, and program activity</p>
                </div>

            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Points Earned", value: filtered.reduce((acc, t) => acc + (t.type === 'Earned' ? t.points : 0), 0), icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Total Points Redeemed", value: filtered.reduce((acc, t) => acc + (t.type === 'Redeemed' ? t.points : 0), 0), icon: Gift, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Elite Customers", value: "24", icon: Trophy, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Total Transactions", value: filtered.length, icon: History, color: "text-blue-500", bg: "bg-blue-50" },
                ].map(stat => (

                    <div key={stat.label} className={`${stat.bg} ${stat.color} p-8 rounded-[32px] border border-coffee-brown/5 flex flex-col gap-3 shadow-sm`}>
                        <stat.icon size={20} />
                        <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[40px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden">
                <div className="p-8 border-b border-coffee-brown/5 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-coffee-brown/20" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by customer name or email..."
                            className="w-full pl-16 pr-6 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-gold/20 transition-all font-bold text-coffee-brown text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-coffee-brown/2 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30 border-b border-coffee-brown/5">
                                <th className="px-8 py-6">Customer Details</th>
                                <th className="px-8 py-6">Points</th>
                                <th className="px-8 py-6">Activity Reason</th>
                                <th className="px-8 py-6 text-right">Date & Time</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-coffee-brown/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? filtered.map((t) => (
                                <tr key={t._id} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center font-black text-coffee-brown/30 text-lg group-hover:bg-accent-gold group-hover:text-white transition-all">
                                                {t.user?.name?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-coffee-brown">{t.user?.name}</p>
                                                <p className="text-[10px] font-bold text-coffee-brown/20 uppercase tracking-widest">{t.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`flex items-center gap-2 font-black text-xl tracking-tighter ${
                                            t.type === 'Earned' ? 'text-emerald-500' : 'text-red-500'
                                        }`}>
                                            {t.type === 'Earned' ? <Zap size={14} /> : <Gift size={14} />}
                                            {t.type === 'Earned' ? '+' : '-'}{t.points}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 mt-1">{t.type} Points</div>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        <p className="text-xs font-bold text-coffee-brown/60 uppercase tracking-tighter leading-tight italic">
                                            "{t.reason}"
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-black text-coffee-brown text-sm">
                                            {new Date(t.createdAt).toLocaleDateString('en-GB')}
                                        </p>
                                        <p className="text-[10px] font-bold text-coffee-brown/20 uppercase tracking-widest">
                                            {new Date(t.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-40 text-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-coffee-brown/20">No matching activities found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLoyalty;
