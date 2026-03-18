import { useState, useEffect } from "react";
import { Calendar, Users, Clock, MapPin, CheckCircle2, AlertCircle, XCircle, Info, ChevronRight, Hash } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const BookTable = () => {
    const { user } = useAuth();
    const [availableTables, setAvailableTables] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [fetchingTables, setFetchingTables] = useState(false);
    const [confirmCancelId, setConfirmCancelId] = useState(null);
    
    const [formData, setFormData] = useState({
        table: "",
        bookingDate: new Date().toISOString().split('T')[0],
        startTime: "12:00",
        endTime: "14:00",
        numberOfPeople: 2,
        specialRequests: ""
    });

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);
        const diff = (eH * 60 + eM) - (sH * 60 + sM);
        return diff;
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    // Fetch available tables whenever date or times change
    useEffect(() => {
        if (formData.bookingDate && formData.startTime && formData.endTime) {
            const duration = calculateDuration(formData.startTime, formData.endTime);
            if (duration > 0 && duration <= 300) {
                fetchAvailableTables();
            } else {
                setAvailableTables([]);
            }
        }
    }, [formData.bookingDate, formData.startTime, formData.endTime]);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/bookings");
            setMyBookings(response.data.data);
        } catch (error) {
            console.error("Failed to load my bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTables = async () => {
        try {
            setFetchingTables(true);
            const response = await api.get(`/bookings/available?date=${formData.bookingDate}&startTime=${formData.startTime}&endTime=${formData.endTime}`);
            setAvailableTables(response.data.data);
            
            // Clear selected table if it's no longer available
            if (formData.table) {
                const stillAvailable = response.data.data.find(t => t._id === formData.table);
                if (!stillAvailable) {
                    setFormData(prev => ({ ...prev, table: "" }));
                }
            }
        } catch (error) {
            toast.error("Failed to fetch available tables");
        } finally {
            setFetchingTables(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please login to book a table");
            return;
        }

        if (!formData.table || !formData.bookingDate || !formData.startTime || !formData.endTime) {
            toast.error("Please fill all required fields");
            return;
        }

        const duration = calculateDuration(formData.startTime, formData.endTime);
        if (duration <= 0) {
            toast.error("End time must be after start time");
            return;
        }
        if (duration > 300) {
            toast.error("Maximum booking duration is 5 hours");
            return;
        }

        try {
            setBookingLoading(true);
            const response = await api.post("/bookings", formData);
            if (response.data.success) {
                toast.success("Table booked successfully!");
                setFormData({
                    table: "",
                    bookingDate: new Date().toISOString().split('T')[0],
                    startTime: "12:00",
                    endTime: "14:00",
                    numberOfPeople: 2,
                    specialRequests: ""
                });
                fetchMyBookings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book table");
        } finally {
            setBookingLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        setConfirmCancelId(id);
    };

    const handleConfirmCancel = async () => {
        if (!confirmCancelId) return;
        try {
            setBookingLoading(true);
            const response = await api.put(`/bookings/${confirmCancelId}/status`, { status: "Cancelled" });
            if (response.data.success) {
                toast.success("Booking cancelled successfully!");
                fetchMyBookings();
                setConfirmCancelId(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel booking");
        } finally {
            setBookingLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toString().toLowerCase();
        switch (s) {
            case 'confirmed': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-emerald-500/10">Confirmed</span>;
            case 'pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-amber-500/10 transition-all duration-700">Pending</span>;
            case 'cancelled': return <span className="px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-red-500/10">Cancelled</span>;
            case 'completed': return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/10">Completed</span>;
            default: return <span className="px-3 py-1 bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-full text-[10px] font-black uppercase tracking-widest">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-coffee-brown border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Premium Header */}
            <div className="relative h-[400px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000" 
                    alt="Cafe Interior" 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent flex flex-col justify-end pb-16 px-6">
                    <div className="max-w-7xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="px-4 py-1.5 bg-accent-gold/20 backdrop-blur-md text-accent-gold rounded-full text-xs font-black uppercase tracking-widest border border-accent-gold/30 mb-4 inline-block">
                                Reservations
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                                SECURE YOUR <br /><span className="text-accent-gold">PERFECT TABLE.</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-xl font-medium leading-relaxed">
                                Join us for an unforgettable culinary journey. Experience premium service in a modern, sophisticated atmosphere.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Advanced Booking Panel */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 border border-neutral-100 h-full">
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-coffee-brown mb-2 tracking-tight">Reserve a Table</h2>
                                    <p className="text-neutral-400 font-medium italic">Please follow the steps to complete your reservation.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-coffee-brown/20 uppercase tracking-[0.3em]">Phase 01</span>
                                    <div className="h-1 w-12 bg-accent-gold ml-auto mt-1 rounded-full" />
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* 1. Date Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-coffee-brown/30 uppercase tracking-[0.2em]">
                                            <Calendar size={12} className="text-accent-gold" /> 01. Select Date
                                        </div>
                                        <input 
                                            type="date" 
                                            className="w-full px-6 py-4 bg-neutral-50 border-2 border-transparent focus:border-accent-gold/30 focus:bg-white rounded-3xl transition-all font-bold text-coffee-brown outline-none shadow-sm"
                                            value={formData.bookingDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                                            required
                                        />
                                    </div>

                                    {/* 3. Number of Guests (MOVED UP) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-coffee-brown/30 uppercase tracking-[0.2em]">
                                            <Users size={12} className="text-accent-gold" /> 03. Number of Guests
                                        </div>
                                        <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-3xl shadow-sm">
                                            {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                                                <button 
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, numberOfPeople: num, table: ""})}
                                                    className={`flex-1 py-3 px-1 rounded-2xl text-[11px] font-black transition-all ${
                                                        formData.numberOfPeople === num 
                                                        ? "bg-white text-coffee-brown shadow-md scale-105" 
                                                        : "text-neutral-300 hover:text-coffee-brown"
                                                    }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Time Window Selection */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-coffee-brown/30 uppercase tracking-[0.2em]">
                                            <Clock size={12} className="text-accent-gold" /> 02. Choose Time Window (Max 5 Hours)
                                        </div>
                                        {calculateDuration(formData.startTime, formData.endTime) > 0 && (
                                            <div className="text-[10px] font-black text-accent-gold uppercase tracking-widest bg-accent-gold/5 px-3 py-1 rounded-full border border-accent-gold/10">
                                                Duration: {Math.floor(calculateDuration(formData.startTime, formData.endTime) / 60)}h {calculateDuration(formData.startTime, formData.endTime) % 60}m
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest pl-4">Start Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full px-6 py-4 bg-neutral-50 border-2 border-transparent focus:border-accent-gold/30 focus:bg-white rounded-3xl transition-all font-bold text-coffee-brown outline-none shadow-sm"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-coffee-brown/40 uppercase tracking-widest pl-4">End Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full px-6 py-4 bg-neutral-50 border-2 border-transparent focus:border-accent-gold/30 focus:bg-white rounded-3xl transition-all font-bold text-coffee-brown outline-none shadow-sm"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {calculateDuration(formData.startTime, formData.endTime) > 300 && (
                                        <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-2xl border border-red-100">
                                            <AlertCircle size={14} /> Maximum allowed duration is 5 hours
                                        </div>
                                    )}
                                </div>

                                {/* Table Selection Area */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-coffee-brown/30 uppercase tracking-[0.2em]">
                                            <MapPin size={12} className="text-accent-gold" /> 04. Select Table Location
                                        </div>
                                        {fetchingTables && <div className="animate-pulse flex items-center gap-2 text-[10px] font-bold text-accent-gold uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-accent-gold rounded-full" /> Updating Availability...</div>}
                                    </div>

                                    {!formData.bookingDate || !formData.startTime || !formData.endTime ? (
                                        <div className="bg-neutral-50 rounded-[32px] p-12 text-center border-2 border-dashed border-neutral-200">
                                            <Info size={32} className="mx-auto text-neutral-300 mb-4" />
                                            <p className="text-neutral-400 font-bold">Please select date and time to see available tables</p>
                                        </div>
                                    ) : availableTables.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                                            {availableTables.map((t) => (
                                                <button
                                                    key={t._id}
                                                    type="button"
                                                    disabled={t.capacity < formData.numberOfPeople}
                                                    onClick={() => setFormData({...formData, table: t._id})}
                                                    className={`group relative p-6 rounded-[32px] transition-all border-2 flex flex-col items-center justify-center gap-3 overflow-hidden ${
                                                        formData.table === t._id 
                                                        ? "bg-white border-accent-gold shadow-xl shadow-accent-gold/10" 
                                                        : t.capacity < formData.numberOfPeople
                                                            ? "opacity-40 grayscale cursor-not-allowed border-transparent bg-neutral-100"
                                                            : "bg-neutral-50 border-transparent hover:border-neutral-200 hover:bg-white"
                                                    }`}
                                                >
                                                    {formData.table === t._id && (
                                                        <div className="absolute top-3 right-3 text-accent-gold">
                                                            <CheckCircle2 size={18} />
                                                        </div>
                                                    )}
                                                    <div className={`p-4 rounded-2xl transition-all ${
                                                        formData.table === t._id ? "bg-accent-gold text-white" : "bg-white text-coffee-brown group-hover:bg-neutral-100"
                                                    }`}>
                                                        <Hash size={24} />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-lg font-black text-coffee-brown">Table {t.tableNumber}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.capacity} Seats • {t.location}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 rounded-[32px] p-12 text-center border-2 border-dashed border-red-100">
                                            <XCircle size={32} className="mx-auto text-red-200 mb-4" />
                                            <p className="text-red-400 font-bold">No tables available for selected time window.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Details - Specialized Steps */}
                                <div className="space-y-4 border-t border-neutral-100 pt-10">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-coffee-brown/30 uppercase tracking-[0.2em]">
                                        <Info size={12} className="text-accent-gold" /> 05. Special Requests (Optional)
                                    </div>
                                    <textarea 
                                        className="w-full px-8 py-5 bg-neutral-50 border-2 border-transparent focus:border-accent-gold/30 focus:bg-white rounded-4xl transition-all font-bold text-coffee-brown outline-none resize-none h-24 shadow-inner"
                                        placeholder="Any dietary requirements, birthday arrangements, or seating preferences?"
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={bookingLoading || !formData.table}
                                    className="w-full py-6 bg-coffee-brown text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-sm hover:scale-[0.99] active:scale-[0.97] transition-all shadow-2xl shadow-coffee-brown/30 disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {bookingLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Complete Reservation
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Booking History Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 border border-neutral-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-3 bg-accent-gold/10 text-accent-gold rounded-2xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-coffee-brown">My Bookings</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Your reservation journey</span>
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {myBookings.length > 0 ? (
                                    myBookings.map((booking) => (
                                        <div key={booking._id} className="p-6 bg-neutral-50 rounded-[32px] border border-transparent hover:border-neutral-200 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="text-xs font-black text-coffee-brown uppercase tracking-[0.2em] opacity-40">
                                                    #{booking._id.slice(-6)}
                                                </div>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            
                                            <div className="mb-6">
                                                <div className="text-2xl font-black text-coffee-brown mb-1">Table {booking.table?.tableNumber || "N/A"}</div>
                                                <div className="text-xs font-bold text-neutral-400 capitalize">{booking.table?.location || "Main Area"}</div>
                                            </div>
                                            
                                            <div className="space-y-3 mb-6 bg-white rounded-3xl p-5 shadow-sm">
                                                <div className="flex items-center gap-3 text-xs font-bold text-coffee-brown/60">
                                                    <Calendar size={14} className="text-accent-gold" />
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-bold text-coffee-brown/60">
                                                    <Clock size={14} className="text-accent-gold" />
                                                    {booking.startTime} - {booking.endTime}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-bold text-coffee-brown/60">
                                                    <Users size={14} className="text-accent-gold" />
                                                    {booking.numberOfPeople} Guests
                                                </div>
                                            </div>

                                            {booking.status?.toLowerCase() === 'pending' && (
                                                <button 
                                                    onClick={() => cancelBooking(booking._id)}
                                                    className="w-full py-3 rounded-2xl border-2 border-red-50 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                                                >
                                                    Cancel Reservation
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Info size={24} className="text-neutral-200" />
                                        </div>
                                        <p className="text-neutral-300 font-bold text-sm">No reservations yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {confirmCancelId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-coffee-brown/40 backdrop-blur-md"
                            onClick={() => setConfirmCancelId(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] text-center"
                        >
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <XCircle size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-coffee-brown tracking-tighter mb-4 leading-none uppercase">Cancel Journey?</h3>
                            <p className="text-sm font-bold text-neutral-400 mb-10 leading-relaxed uppercase tracking-tighter">Are you certain you wish to cancel this reservation? This action will immediately release the table for other guests.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setConfirmCancelId(null)} 
                                    className="flex-1 py-4 font-black text-[10px] uppercase tracking-[0.3em] text-coffee-brown hover:bg-neutral-50 rounded-2xl transition-all"
                                >
                                    Keep it
                                </button>
                                <button 
                                    onClick={handleConfirmCancel} 
                                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                                >
                                    Abandone
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookTable;
