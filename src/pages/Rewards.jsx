import { useState, useEffect } from "react";
import { Gift, Zap, TrendingUp, Info, CheckCircle2, XCircle, ChevronRight, Bookmark } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
    const { selectedReward, setSelectedReward, cart } = useShop();
    const [rewards, setRewards] = useState([]);
    const [userLoyalty, setUserLoyalty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmationReward, setConfirmationReward] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rewardsRes, loyaltyRes] = await Promise.all([
                api.get("/rewards"),
                api.get("/loyalty/me")
            ]);
            setRewards(rewardsRes.data.data);
            setUserLoyalty(loyaltyRes.data.data.user);
        } catch (error) {
            console.error("Failed to fetch rewards", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmRedeem = async () => {
        if (!confirmationReward) return;
        
        if (cart.length === 0) {
            toast.error("Add items to your cart first to apply this reward!");
            setConfirmationReward(null);
            return;
        }

        setSelectedReward(confirmationReward);
        setConfirmationReward(null);
        toast.success(`"${confirmationReward.name}" applied to cart!`);
        navigate('/cart');
    };

    const handleRemoveReward = (e, rewardId) => {
        e.stopPropagation();
        if (selectedReward?._id === rewardId) {
            setSelectedReward(null);
            toast.success("Reward removed from cart");
        }
    };


    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-16 animate-fade-in">
            {/* Minimalist Header */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-accent-gold/5 text-accent-gold rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-gold/10">
                    <Zap size={10} /> Exclusive Catalogue
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-coffee-brown tracking-tighter leading-[0.85]">
                    CURATED <br /><span className="text-accent-gold">PRIVILEGES.</span>
                </h1>
                <p className="text-coffee-brown/40 font-bold uppercase tracking-widest text-[11px]">
                    Your current balance: <span className="text-accent-gold">{userLoyalty?.loyaltyPoints || 0} Points</span>
                </p>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rewards.length > 0 ? rewards.map((r) => (
                    <div key={r._id} className="group bg-white rounded-[48px] p-10 border border-coffee-brown/5 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between h-full">
                        <div className="space-y-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-xl ${
                                    r.type === 'Discount' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                    r.type === 'FreeItem' ? 'bg-amber-500 shadow-amber-500/20' : 
                                    'bg-blue-500 shadow-blue-500/20'
                                }`}>
                                    {r.type === 'Discount' ? <TrendingUp size={28} strokeWidth={2.5} /> : <Gift size={28} strokeWidth={2.5} />}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/20 italic">Points Required</span>
                                    <div className="text-3xl font-black text-accent-gold tracking-tighter">{r.pointsRequired}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-coffee-brown leading-tight tracking-tight">{r.name}</h3>
                                <p className="text-sm font-bold text-coffee-brown/30 uppercase tracking-widest line-clamp-2">{r.description}</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-coffee-brown/5 space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-coffee-brown/40">
                                <div className="p-2 bg-cream rounded-xl text-accent-gold"><Bookmark size={12} /></div>
                                {r.type} Value: {r.type === 'Discount' ? `${r.value}% OFF` : 'Exclusive Delight'}
                            </div>

                            <button 
                                onClick={() => {
                                    if (selectedReward?._id === r._id) {
                                        setSelectedReward(null);
                                        toast.success("Reward removed");
                                    } else if (!selectedReward) {
                                        setConfirmationReward(r);
                                    }
                                }}
                                disabled={(selectedReward && selectedReward._id !== r._id) || (userLoyalty?.loyaltyPoints < r.pointsRequired)}
                                className={`w-full py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                                    userLoyalty?.loyaltyPoints < r.pointsRequired 
                                    ? "bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed" 
                                    : selectedReward?._id === r._id
                                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                    : (selectedReward && selectedReward._id !== r._id)
                                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed grayscale"
                                    : "bg-coffee-brown text-white shadow-xl shadow-coffee-brown/20 hover:scale-[1.02] active:scale-[0.98] hover:bg-black"
                                }`}
                            >

                                {selectedReward?._id === r._id ? (
                                    <>Applied <CheckCircle2 size={16} /></>
                                ) : (selectedReward && selectedReward._id !== r._id) ? (
                                    <>Locked <Info size={16} /></>
                                ) : userLoyalty?.loyaltyPoints < r.pointsRequired ? (
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2">Points Locked <XCircle size={16} /></div>
                                        <span className="text-[8px] font-bold mt-1 text-red-400 normal-case tracking-tight">Need {r.pointsRequired - (userLoyalty?.loyaltyPoints || 0)} more points</span>
                                    </div>
                                ) : (
                                    <>Redeem & Apply <CheckCircle2 size={16} /></>
                                )}

                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-40 text-center space-y-4">
                        <Info size={40} className="mx-auto text-coffee-brown/10" />
                        <p className="text-coffee-brown/30 font-bold">No active rewards available right now.</p>
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="bg-coffee-brown rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight">Need more points?</h4>
                    <p className="text-white/40 text-sm font-medium">Keep ordering your favorites and watch your balance grow.</p>
                </div>
                <button className="px-10 py-5 bg-accent-gold text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-4 hover:bg-white hover:text-coffee-brown transition-all">
                    Discover More <ChevronRight size={18} />
                </button>
            </div>

            {/* Redemption Confirmation Modal */}
            {confirmationReward && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-coffee-brown/60 backdrop-blur-xl animate-fade-in" onClick={() => setConfirmationReward(null)} />
                    <div className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 space-y-8 text-center border border-white/20">
                        <div className="relative mx-auto w-24 h-24 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <Gift size={40} className="text-accent-gold" strokeWidth={1.5} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-coffee-brown rounded-full flex items-center justify-center text-white text-[10px] font-black">!</div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-coffee-brown tracking-tighter">Claim Reward?</h2>
                            <p className="text-coffee-brown/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                                You are about to spend <span className="text-accent-gold">{confirmationReward.pointsRequired} Points</span> for "{confirmationReward.name}".
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={handleConfirmRedeem}
                                className="w-full py-5 bg-accent-gold text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-accent-gold/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                            >
                                Confirm Redemption
                            </button>
                            <button 
                                onClick={() => setConfirmationReward(null)}
                                className="w-full py-5 text-coffee-brown font-black uppercase tracking-[0.2em] text-[10px] hover:text-black transition-all"
                            >
                                Not Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Rewards;
