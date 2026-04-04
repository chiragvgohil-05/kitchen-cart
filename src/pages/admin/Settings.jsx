import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Settings = () => {
    const { settings, setSettings } = useShop();
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        mobile: '',
        email: '',
        facebook: '',
        instagram: '',
        twitter: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                address: settings.address || '',
                phone: settings.phone || '',
                mobile: settings.mobile || '',
                email: settings.email || '',
                facebook: settings.facebook || '',
                instagram: settings.instagram || '',
                twitter: settings.twitter || ''
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/settings', formData);
            if (res.data && res.data.success) {
                setSettings(res.data.data);
                toast.success('Settings updated successfully');
            }
        } catch (error) {
            console.error('Update settings error:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-coffee-brown tracking-tight">Cafe Settings</h1>
                <p className="text-coffee-brown/40 font-medium tracking-wide">Configure the official contact details and social media profiles for SnowEra Cafe.</p>
            </div>


            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-coffee-brown/60 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-accent-gold" />
                                Business Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-coffee-brown/10 focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none resize-none font-medium"
                                placeholder="Enter full business address..."
                            />

                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-semibold text-coffee-brown/60 mb-2 flex items-center gap-2">
                                <Phone size={16} className="text-accent-gold" />
                                Contact Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-coffee-brown/10 focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none font-medium"
                                placeholder="+91 1234567890"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="text-sm font-semibold text-coffee-brown/60 mb-2 flex items-center gap-2">
                                <Phone size={16} className="text-accent-gold rotate-12" />
                                Contact Mobile
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-coffee-brown/10 focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none font-medium"
                                placeholder="+91 9876543210"
                            />
                        </div>


                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-coffee-brown/60 mb-2 flex items-center gap-2">
                                <Mail size={16} className="text-accent-gold" />
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-coffee-brown/10 focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none font-medium"
                                placeholder="hello@example.com"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="md:col-span-2 pt-4 border-t border-coffee-brown/5">
                            <h3 className="text-lg font-bold text-coffee-brown mb-4 tracking-tight">Social Presence</h3>
                        </div>


                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" />
                                Facebook URL
                            </label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">

                                <Instagram size={16} className="text-pink-600" />
                                Instagram URL
                            </label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">

                                <Twitter size={16} className="text-sky-500" />
                                Twitter URL
                            </label>
                            <input
                                type="text"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-coffee-brown/2 border-t border-coffee-brown/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-10 py-3.5 bg-coffee-brown text-white rounded-xl font-bold hover:bg-accent-gold transition-all shadow-xl shadow-coffee-brown/10 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'PUBLISHING...' : 'SAVE CONFIGURATION'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Settings;
