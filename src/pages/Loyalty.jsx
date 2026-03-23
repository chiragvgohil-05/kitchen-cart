import { useState, useEffect } from "react";
import { 
    Trophy, Star, History, Gift, TrendingUp, 
    ChevronRight, Award, Zap, Coins, Info 
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";


const Loyalty = () => {
    const [data, setData] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimLoading, setClaimLoading] = useState(false);


    const fetchLoyalty = async () => {
        try {
            const response = await api.get("/loyalty/me");
            setData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch loyalty data", error);
        }
    };

    const fetchRewards = async () => {
        try {
            const response = await api.get("/rewards");
            // Only show active rewards
            setRewards(response.data.data.filter(r => r.isActive));
        } catch (error) {
            console.error("Failed to fetch rewards", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchLoyalty(), fetchRewards()]);
            setLoading(false);
        };
        init();
    }, []);

    const handleClaimReward = async (reward) => {
        try {
            setClaimLoading(true);
            const response = await api.post(`/rewards/${reward._id}/redeem`);
            if (response.data.success) {
                // Refresh data
                await fetchLoyalty();
                toast.success(`Successfully claimed ${reward.name}!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Redemption failed");
        } finally {
            setClaimLoading(false);
        }
    };



    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full" />
        </div>
    );

    const { user, transactions } = data || {};

    const TIER_CONFIG = {
        Bronze: { color: "text-orange-600", bg: "bg-orange-50", icon: Trophy, next: 1000 },
        Silver: { color: "text-slate-400", bg: "bg-slate-50", icon: Award, next: 5000 },
        Gold: { color: "text-yellow-600", bg: "bg-yellow-50", icon: Star, next: 10000 },
        Platinum: { color: "text-purple-600", bg: "bg-purple-50", icon: Zap, next: null }
    };

    const currentTier = TIER_CONFIG[user?.loyaltyTier] || TIER_CONFIG.Bronze;
    const TierIcon = currentTier.icon;
    const progress = currentTier.next ? (user?.loyaltyPoints / currentTier.next) * 100 : 100;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="relative rounded-[48px] bg-coffee-brown p-10 md:p-20 overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className={`w-fit px-4 py-2 ${currentTier.bg} ${currentTier.color} rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2`}>
                            <TierIcon size={14} />
                            {user?.loyaltyTier} Member
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            YOUR REWARD <br /><span className="text-accent-gold">JOURNEY.</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-md font-medium">
                            Every cup tells a story. Every point brings you closer to exclusive perks and free delights.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-80 space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Balance</span>
                                <Coins size={20} className="text-accent-gold" />
                            </div>
                            <div className="text-6xl font-black tracking-tighter text-accent-gold">
                                {user?.loyaltyPoints || 0}
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <span>Progress to next tier</span>
                                    <span>{progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-accent-gold shadow-[0_0_20px_rgba(219,171,114,0.5)]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-coffee-brown/5 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-coffee-brown tracking-tight">Tier Benefits</h3>
                        <p className="text-sm font-bold text-coffee-brown/30 mt-1">Enjoy {user?.loyaltyTier === 'Gold' ? '1.5x' : '1x'} points on every purchase.</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-coffee-brown/5 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                        <Gift size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-coffee-brown tracking-tight">Ready to Redeem</h3>
                        <p className="text-sm font-bold text-coffee-brown/30 mt-1">Check out available rewards for your point balance.</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-coffee-brown/5 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-coffee-brown tracking-tight">Point Expiry</h3>
                        <p className="text-sm font-bold text-coffee-brown/30 mt-1">Your points are active for 365 days from earning.</p>
                    </div>
                </div>
            </div>

            {/* History & Rewards Toggle (Simplified for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Transaction History */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-coffee-brown tracking-tighter flex items-center gap-4">
                            <History className="text-accent-gold" />
                            Recent Activity
                        </h2>
                    </div>

                    <div className="bg-white rounded-[40px] border border-coffee-brown/5 shadow-sm overflow-hidden">
                        {transactions?.length > 0 ? (
                            <div className="divide-y divide-coffee-brown/5">
                                {transactions.map((t) => (
                                    <div key={t._id} className="p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                                t.type === 'Earned' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {t.type === 'Earned' ? <Zap size={24} /> : <Gift size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-coffee-brown">{t.reason}</p>
                                                <p className="text-xs font-bold text-coffee-brown/30 uppercase tracking-widest mt-1">
                                                    {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-black tracking-tighter ${
                                            t.type === 'Earned' ? 'text-emerald-500' : 'text-red-500'
                                        }`}>
                                            {t.type === 'Earned' ? '+' : '-'}{t.points}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <Info size={40} className="mx-auto text-coffee-brown/10" />
                                <p className="text-coffee-brown/30 font-bold">No transactions found yet. Start earning!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-3xl font-black text-coffee-brown tracking-tighter">Exclusive Perks</h2>
                    <div className="space-y-4">
                        {rewards.length > 0 ? (
                            rewards.slice(0, 5).map((p) => {
                                const userPoints = user?.loyaltyPoints || 0;
                                const canClaim = userPoints >= p.pointsRequired;
                                const rewardProgress = Math.min(100, (userPoints / p.pointsRequired) * 100);
                                
                                return (
                                    <div key={p._id} className={`bg-cream rounded-3xl p-6 border transition-all relative overflow-hidden group ${canClaim ? 'border-accent-gold/40 bg-white' : 'border-coffee-brown/5 opacity-80'}`}>
                                        {!canClaim && (
                                            <div className="absolute bottom-0 left-0 h-1 bg-coffee-brown/5 w-full">
                                                <div 
                                                    className="h-full bg-accent-gold/20 transition-all duration-1000" 
                                                    style={{ width: `${rewardProgress}%` }}
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm transition-all ${canClaim ? 'text-accent-gold group-hover:bg-accent-gold group-hover:text-white' : 'text-coffee-brown/20'}`}>
                                                <Gift size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-coffee-brown text-sm">{p.name}</h4>
                                                <p className="text-[10px] font-bold text-coffee-brown/40 uppercase tracking-widest">{p.pointsRequired} Points Required</p>
                                            </div>
                                            {canClaim ? (
                                                <button 
                                                    onClick={() => handleClaimReward(p)}
                                                    disabled={claimLoading}
                                                    className="px-5 py-2.5 bg-accent-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent-gold/20 disabled:opacity-50"
                                                >
                                                    Claim
                                                </button>
                                            ) : (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[9px] font-black text-accent-gold uppercase tracking-widest">
                                                        {rewardProgress.toFixed(0)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-4 text-[11px] font-bold text-coffee-brown/40 leading-relaxed uppercase tracking-wide">
                                            {p.description}
                                        </p>
                                        {!canClaim && (
                                            <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-coffee-brown/20 uppercase tracking-widest">
                                                <div className="w-1 h-1 rounded-full bg-accent-gold/40 animate-pulse" />
                                                Need {p.pointsRequired - userPoints} more points
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center border border-dashed border-coffee-brown/10 rounded-3xl">
                                <p className="text-sm font-bold text-coffee-brown/20">No rewards available</p>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Loyalty;
