import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, MapPin, Save, ArrowLeft, Building, Globe, Send } from "lucide-react";
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
        <div className="min-h-screen bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(user?.role === 'admin' ? "/admin" : -1)}
                    className="flex items-center gap-2 text-brand-primary/60 hover:text-brand-primary font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-primary/5 overflow-hidden border border-brand-primary/5">
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-brand-primary tracking-tight">Profile Settings</h1>
                                <p className="text-gray-500 font-medium mt-2">Update your personal information and address</p>
                            </div>
                            <div className="flex items-center gap-4 bg-brand-bg p-4 rounded-3xl">
                                <div className="w-16 h-16 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-primary font-black text-2xl shadow-lg shadow-brand-accent/20">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-black text-brand-primary uppercase tracking-wider">{user?.name}</p>
                                    <p className="text-xs font-bold text-brand-accent uppercase tracking-tighter">{user?.role}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Basic Info Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                                        <User size={20} className="text-brand-primary" />
                                    </div>
                                    <h2 className="text-xl font-black text-brand-primary uppercase tracking-tight">Basic Information</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">Email Address</label>
                                        <div className="relative group opacity-60">
                                            <input
                                                type="email"
                                                disabled
                                                className="w-full pl-4 pr-4 py-3.5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl cursor-not-allowed font-bold text-brand-primary"
                                                value={formData.email}
                                            />
                                            <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                                <Mail size={16} className="text-brand-primary/30" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-brand-primary/10" />

                            {/* Address Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                                        <MapPin size={20} className="text-brand-primary" />
                                    </div>
                                    <h2 className="text-xl font-black text-brand-primary uppercase tracking-tight">Delivery Address</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">Street Address</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="street"
                                                className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                                placeholder="123 Kitchen Lane"
                                                value={formData.address.street}
                                                onChange={handleAddressChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                            placeholder="City"
                                            value={formData.address.city}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">State / Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                            placeholder="State"
                                            value={formData.address.state}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">Zip / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                            placeholder="12345"
                                            value={formData.address.zipCode}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-brand-primary/60 ml-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="w-full pl-4 pr-4 py-3.5 bg-brand-bg border border-brand-primary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary"
                                            placeholder="Country"
                                            value={formData.address.country}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="flex items-center justify-end gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate(user?.role === 'admin' ? "/admin" : "/")}
                                    className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-3 px-10 py-4 bg-brand-primary text-white rounded-3xl font-black uppercase tracking-widest hover:bg-brand-primary/95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        <span>{loading ? "Saving..." : "Save Changes"}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-brand-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20" />
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
