import { useState, useEffect } from "react";
import { Calendar, Users, Clock, MapPin, CheckCircle2, AlertCircle, XCircle, Info } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const BookTable = () => {
    const { user } = useAuth();
    const [tables, setTables] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        table: "",
        bookingDate: "",
        bookingTime: "",
        numberOfGuests: 2,
        specialRequests: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tablesRes, bookingsRes] = await Promise.all([
                api.get("/tables"),
                api.get("/bookings/mybookings")
            ]);
            
            setTables(tablesRes.data.data.filter(t => t.status === 'Available'));
            setMyBookings(bookingsRes.data.data);
        } catch (error) {
            toast.error("Failed to load table information");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!formData.table || !formData.bookingDate || !formData.bookingTime) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setBookingLoading(true);
            const response = await api.post("/bookings", formData);
            if (response.data.success) {
                toast.success("Table booked successfully!");
                setFormData({
                    table: "",
                    bookingDate: "",
                    bookingTime: "",
                    numberOfGuests: 2,
                    specialRequests: ""
                });
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book table");
        } finally {
            setBookingLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>;
            case 'Pending': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
            case 'Cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
            case 'Completed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Hero Section */}
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                    alt="Cafe Interior" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Reserve Your Spot.</h1>
                    <p className="text-white/70 text-lg max-w-md font-medium leading-relaxed">
                        Experience exceptional dining. Book your favorite table in advance and skip the wait.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Booking Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-coffee-brown/5 sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-accent-gold/10 rounded-2xl text-accent-gold">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-coffee-brown">Book a Table</h2>
                                <p className="text-xs text-coffee-brown/40 font-bold uppercase tracking-widest">Reserve in seconds</p>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-coffee-brown/40 uppercase tracking-widest px-1">Select Table</label>
                                <select 
                                    className="w-full px-4 py-3 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white focus:border-accent-gold/20 transition-all font-bold text-coffee-brown text-sm"
                                    value={formData.table}
                                    onChange={(e) => setFormData({...formData, table: e.target.value})}
                                    required
                                >
                                    <option value="">Choose a table...</option>
                                    {tables.map(t => (
                                        <option key={t._id} value={t._id}>
                                            Table {t.tableNumber} ({t.capacity} seats) - {t.location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-coffee-brown/40 uppercase tracking-widest px-1">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-3 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white focus:border-accent-gold/20 transition-all font-bold text-coffee-brown text-sm"
                                        value={formData.bookingDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-coffee-brown/40 uppercase tracking-widest px-1">Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full px-4 py-3 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white focus:border-accent-gold/20 transition-all font-bold text-coffee-brown text-sm"
                                        value={formData.bookingTime}
                                        onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-coffee-brown/40 uppercase tracking-widest px-1">Number of Guests</label>
                                <div className="flex items-center gap-4 bg-coffee-brown/5 p-1 rounded-2xl">
                                    {[1,2, 3, 4, 5, 6].map(num => (
                                        <button 
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({...formData, numberOfGuests: num})}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
                                                formData.numberOfGuests === num 
                                                ? "bg-white text-accent-gold shadow-sm" 
                                                : "text-coffee-brown/40 hover:text-coffee-brown"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-coffee-brown/40 uppercase tracking-widest px-1">Special Requests</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-coffee-brown/5 border-transparent rounded-2xl focus:ring-2 focus:ring-accent-gold/20 focus:bg-white focus:border-accent-gold/20 transition-all font-bold text-coffee-brown text-sm resize-none h-24"
                                    placeholder="Any allergies or special occasions?"
                                    value={formData.specialRequests}
                                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={bookingLoading}
                                className="w-full py-4 bg-coffee-brown text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-coffee-brown/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {bookingLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Bookings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-coffee-brown">My History</h2>
                            <p className="text-sm font-medium text-coffee-brown/40 italic">Your previous and upcoming reservations</p>
                        </div>
                    </div>

                    {myBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myBookings.map((booking) => (
                                <div key={booking._id} className="bg-white rounded-3xl p-6 shadow-sm border border-coffee-brown/5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-coffee-brown/5 rounded-2xl text-coffee-brown group-hover:bg-accent-gold group-hover:text-white transition-all">
                                            <Users size={24} />
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-coffee-brown mb-4 tracking-tight">Table {booking.table?.tableNumber || "N/A"}</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm font-bold text-coffee-brown/60">
                                            <Calendar size={16} className="text-accent-gold" />
                                            {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-coffee-brown/60">
                                            <Clock size={16} className="text-accent-gold" />
                                            {booking.bookingTime}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-coffee-brown/60">
                                            <Users size={16} className="text-accent-gold" />
                                            {booking.numberOfGuests} Guests
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-coffee-brown/60">
                                            <MapPin size={16} className="text-accent-gold" />
                                            {booking.table?.location || "Main Area"}
                                        </div>
                                    </div>

                                    {booking.specialRequests && (
                                        <div className="mt-6 p-4 bg-cream rounded-2xl text-[11px] font-bold text-coffee-brown/40 uppercase tracking-widest leading-relaxed">
                                            "{booking.specialRequests}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-coffee-brown/10">
                            <div className="w-20 h-20 bg-coffee-brown/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Info size={32} className="text-coffee-brown/20" />
                            </div>
                            <h3 className="text-xl font-black text-coffee-brown mb-2 tracking-tight">No Bookings Yet</h3>
                            <p className="text-coffee-brown/40 text-sm font-medium max-w-xs mx-auto">
                                You haven't made any table reservations yet. Use the form to your left to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookTable;
