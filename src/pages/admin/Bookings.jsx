import { useState, useEffect } from "react";
import { 
    Calendar, Users, Clock, Info, CheckCircle2, XCircle, 
    AlertCircle, Search, Filter, Mail, Phone, MapPin 
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/bookings");
            setBookings(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await api.put(`/bookings/${id}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Booking ${newStatus.toLowerCase()}!`);
                fetchBookings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = 
            b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            b.table?.tableNumber.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Confirmed': return "bg-green-50 text-green-600 border-green-100";
            case 'Pending': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'Cancelled': return "bg-red-50 text-red-600 border-red-100";
            case 'Completed': return "bg-blue-50 text-blue-600 border-blue-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-coffee-brown tracking-tight">Reservations</h1>
                    <p className="text-sm font-bold text-coffee-brown/30 uppercase tracking-widest">Guest Table Management</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-brown/20" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by guest name or table number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-coffee-brown/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all font-medium text-coffee-brown shadow-sm text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                statusFilter === s 
                                ? "bg-coffee-brown text-white border-transparent shadow-lg shadow-coffee-brown/20" 
                                : "bg-white text-coffee-brown/40 border-coffee-brown/10 hover:border-coffee-brown/30"
                            }`}
                        >
                            {s === 'all' ? 'All Bookings' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="p-24 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full mx-auto" />
                </div>
            ) : filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-[2rem] p-8 border border-coffee-brown/5 shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Guest Info */}
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-coffee-brown/5 flex items-center justify-center font-black text-coffee-brown/30 transition-colors group-hover:bg-accent-gold group-hover:text-white">
                                            {booking.user?.name?.[0]?.toUpperCase() || 'G'}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-coffee-brown text-lg tracking-tight leading-none mb-1">{booking.user?.name}</h3>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-coffee-brown/30 uppercase tracking-widest">
                                                <Mail size={10} />
                                                {booking.user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-coffee-brown/2 rounded-2xl space-y-1">
                                            <span className="text-[10px] font-black text-coffee-brown/20 uppercase tracking-widest">Reservation</span>
                                            <div className="flex items-center gap-2 text-sm font-bold text-coffee-brown/70">
                                                <Calendar size={14} className="text-accent-gold" />
                                                {new Date(booking.bookingDate).toLocaleDateString('en-GB')}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-coffee-brown/70">
                                                <Clock size={14} className="text-accent-gold" />
                                                {booking.bookingTime}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-coffee-brown/2 rounded-2xl space-y-1">
                                            <span className="text-[10px] font-black text-coffee-brown/20 uppercase tracking-widest">Table Details</span>
                                            <div className="flex items-center gap-2 text-sm font-bold text-coffee-brown/70">
                                                <Users size={14} className="text-accent-gold" />
                                                {booking.numberOfGuests} Guests
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-coffee-brown/70">
                                                <MapPin size={14} className="text-accent-gold" />
                                                Table {booking.table?.tableNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions & Status */}
                                <div className="md:w-48 flex flex-col justify-between items-end gap-6 border-t md:border-t-0 md:border-l border-coffee-brown/5 pt-6 md:pt-0 md:pl-6">
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                        {booking.status}
                                    </div>

                                    <div className="w-full space-y-2">
                                        {booking.status === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                                    className="w-full py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle2 size={12} />
                                                    Confirm
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                                                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={12} />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'Confirmed' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                                className="w-full py-3 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={12} />
                                                Mark Arrival
                                            </button>
                                        )}
                                        {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                                            <div className="text-center py-4 text-coffee-brown/20">
                                                <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Process Fine</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {booking.specialRequests && (
                                <div className="mt-8 p-5 bg-cream/30 rounded-2xl border border-coffee-brown/5 relative italic">
                                    <Info size={14} className="absolute -top-2 -left-2 text-accent-gold bg-white rounded-full p-0.5" />
                                    <p className="text-xs font-bold text-coffee-brown/40 leading-relaxed uppercase tracking-tighter">
                                        "{booking.specialRequests}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-24 text-center border-2 border-dashed border-coffee-brown/5">
                    <Info size={48} className="text-coffee-brown/10 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-coffee-brown mb-2 tracking-tight">No reservations found</h3>
                    <p className="text-sm font-bold text-coffee-brown/20 uppercase tracking-widest">Adjust your filters or search terms</p>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
