import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Gift, TrendingUp, Info } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminRewards = () => {
    const [rewards, setRewards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        pointsRequired: 500,
        type: "Discount",
        value: 10,
        isActive: true
    });

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const response = await api.get("/rewards");
            setRewards(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch rewards");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReward) {
                await api.put(`/rewards/${editingReward._id}`, formData);
                toast.success("Reward updated");
            } else {
                await api.post("/rewards", formData);
                toast.success("Reward created");
            }
            setIsModalOpen(false);
            setEditingReward(null);
            fetchRewards();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (reward) => {
        setEditingReward(reward);
        setFormData({
            name: reward.name,
            description: reward.description,
            pointsRequired: reward.pointsRequired,
            type: reward.type,
            value: reward.value,
            isActive: reward.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/rewards/${id}`);
            toast.success("Reward deleted");
            fetchRewards();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-coffee-brown tracking-tighter">Reward Management</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Manage customer loyalty rewards and redemptions</p>
                </div>

                <button
                    onClick={() => { setEditingReward(null); setIsModalOpen(true); }}
                    className="flex items-center gap-3 bg-coffee-brown text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-coffee-brown/20"
                >
                    <Plus size={16} /> Create New Reward
                </button>

            </div>

            {loading ? (
                <div className="p-24 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full mx-auto" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map(r => (
                        <div key={r._id} className={`bg-white rounded-[32px] p-8 border ${r.isActive ? 'border-coffee-brown/5' : 'border-red-100 opacity-60'} shadow-sm hover:shadow-xl transition-all group relative`}>
                            <div className="flex gap-2 absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(r)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(r._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${r.type === 'Discount' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {r.type === 'Discount' ? <TrendingUp size={24} /> : <Gift size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-black text-coffee-brown tracking-tight">{r.name}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">{r.pointsRequired} Pts Required</span>
                                </div>
                            </div>

                            <p className="text-xs font-bold text-coffee-brown/40 uppercase tracking-widest leading-relaxed line-clamp-2">
                                {r.description}
                            </p>

                            <div className="mt-8 pt-8 border-t border-coffee-brown/5 flex items-center justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/20">
                                    Value: {r.type === 'Discount' ? `${r.value}% OFF` : `Valued at ${r.value}`}
                                </div>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${r.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                    {r.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-coffee-brown/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-coffee-brown mb-8 tracking-tighter">
                            {editingReward ? 'Edit Existing Reward' : 'Configure New Reward'}
                        </h2>


                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                    placeholder="e.g. 10% OFF Signature Brew"
                                    value={formData.name}

                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown h-24 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Points Required</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                        value={formData.pointsRequired}
                                        onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Value (Benefit Amount)</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            className="w-full px-5 py-4 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold text-coffee-brown"
                                            value={formData.value}
                                            placeholder={formData.type === 'Discount' ? "Percentage (e.g. 10)" : "Points Val (e.g. 100)"}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-coffee-brown/20 uppercase">
                                            {formData.type === 'Discount' ? '%' : 'PTS'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-bold text-coffee-brown/30 mt-2 px-1">
                                        {formData.type === 'Discount' ? "Specify the discount percentage applied at checkout." : "Enter the approximate point value of the free item."}
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest px-1">Reward Type</label>
                                <div className="flex gap-2">
                                    {['Discount', 'FreeItem', 'Voucher'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t })}
                                            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${formData.type === t
                                                ? "bg-coffee-brown text-white border-transparent shadow-lg"
                                                : "bg-white text-coffee-brown/40 border-coffee-brown/10 hover:border-coffee-brown/30"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-coffee-brown/5 text-coffee-brown font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-coffee-brown/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 py-4 bg-accent-gold text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-gold/20"
                                >
                                    {editingReward ? 'Apply Changes' : 'Publish Reward'}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRewards;
