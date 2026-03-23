import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, MapPin, Save, ArrowLeft, Building, Globe, Send, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                address: {
                    street: user.address?.street || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    zipCode: user.address?.zipCode || "",
                    country: user.address?.country || ""
                }
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateProfile(formData);
        setLoading(false);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    return (
        <div className="min-h-screen bg-cream py-20 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(user?.role === 'admin' ? "/admin" : -1)}
                    className="flex items-center gap-3 text-coffee-brown/40 hover:text-accent-gold font-medium text-sm mb-12 transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-500" />
                    GO BACK
                </button>

                <div className="bg-white rounded-3xl shadow-2xl shadow-coffee-brown/5 overflow-hidden border border-coffee-brown/5 relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-gold/10 transition-colors duration-1000" />
                    
                    <div className="p-6 sm:p-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-20 pb-12 border-b border-coffee-brown/5">
                            <div>
                                <h1 className="text-3xl font-bold text-coffee-brown">Your <br /><span className="text-accent-gold not-">PROFILE</span></h1>
                                <p className="text-coffee-brown/40 font-bold tracking-widest text-sm mt-4">Update your personal information</p>
                            </div>
                            <div className="flex items-center gap-6 bg-cream/50 backdrop-blur-xl p-6 rounded-2xl border border-coffee-brown/5 shadow-inner">
                                <div className="w-20 h-12 rounded-3xl bg-coffee-brown flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-coffee-brown/20 transform hover:scale-105 transition-transform duration-500">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-coffee-brown tracking-wide text-sm">{user?.name}</p>
                                    <p className="text-sm font-bold text-accent-gold tracking-wide mb-3">{user?.role}</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-coffee-brown/60 bg-white px-4 py-2 rounded-full border border-coffee-brown/5 shadow-sm">
                                        <Wallet size={12} className="text-accent-gold" />
                                        <span>{user?.walletBalance || 0} POINTS</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-16">
                            {/* Essence Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-coffee-brown text-white rounded-2xl shadow-xl shadow-coffee-brown/10">
                                        <User size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-coffee-brown tracking-tighter">Personal Info</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/20 shadow-inner"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">Email</label>
                                        <div className="relative opacity-50 group">
                                            <input
                                                type="email"
                                                disabled
                                                className="w-full pl-6 pr-12 py-4 bg-coffee-brown/5 border border-coffee-brown/10 rounded-3xl cursor-not-allowed font-bold text-coffee-brown shadow-inner"
                                                value={formData.email}
                                            />
                                            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-coffee-brown/20 group-hover:text-accent-gold transition-colors">
                                                <Mail size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-coffee-brown/5" />

                            {/* Coordinates Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-accent-gold text-white rounded-2xl shadow-xl shadow-accent-gold/10">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-coffee-brown tracking-tighter">Address Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">Street</label>
                                        <input
                                            type="text"
                                            name="street"
                                            className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                            placeholder="Enter your street address"
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                            placeholder="City"
                                            value={formData.address.city}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                            placeholder="State"
                                            value={formData.address.state}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                            placeholder="Zip Code"
                                            value={formData.address.zipCode}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-coffee-brown/70 ml-2">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="w-full px-6 py-4 bg-cream border border-coffee-brown/5 rounded-3xl focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold outline-none transition-all font-bold text-coffee-brown placeholder:text-coffee-brown/10 shadow-inner"
                                            placeholder="Country"
                                            value={formData.address.country}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="flex items-center justify-end gap-6 pt-10">
                                <button
                                    type="button"
                                    onClick={() => navigate(user?.role === 'admin' ? "/admin" : "/")}
                                    className="px-6 py-3 rounded-full font-bold tracking-wide text-coffee-brown/40 hover:text-red-400 hover:bg-red-50 transition-all text-sm border border-transparent hover:border-red-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-4 px-6 py-3 bg-coffee-brown text-white rounded-full font-bold tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 disabled:opacity-70 disabled:cursor-not-allowed group h-12 min-w-[150px]"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} className="group-hover:scale-125 transition-transform" />
                                            <span className="text-sm">Save Profile</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
