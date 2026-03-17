import { useState, useEffect } from "react";
import {
    Search, Trash2, User as UserIcon, Mail, Calendar,
    MapPin, ShieldCheck, ShieldAlert, UserCog, ChevronDown
} from "lucide-react";
import api from "../../utils/api";
import DeleteModal from "../../components/admin/DeleteModal";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ROLE_STYLES = {
    admin: {
        label: "Admin",
        icon: ShieldCheck,
        classes: "bg-amber-50 border-amber-200 text-amber-700",
    },
    staff: {
        label: "Staff",
        icon: ShieldAlert,
        classes: "bg-blue-50 border-blue-200 text-blue-700",
    },
    user: {
        label: "User",
        icon: UserIcon,
        classes: "bg-coffee-brown/5 border-coffee-brown/10 text-coffee-brown/50",
    },
};

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingRoleId, setUpdatingRoleId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            if (!response.data?.success) throw new Error(response.data?.message || "Fetch failed");
            setUsers(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser?._id) {
            toast.error("You cannot change your own role.");
            return;
        }
        try {
            setUpdatingRoleId(userId);
            const response = await api.put(`/users/${userId}/role`, { role: newRole });
            if (!response.data?.success) throw new Error(response.data?.message || "Update failed");
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to update role");
        } finally {
            setUpdatingRoleId(null);
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/users/${selectedUser._id}`);
            toast.success("User deleted successfully");
            fetchUsers();
            setIsDeleteOpen(false);
            setSelectedUser(null);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete user");
            setIsDeleteOpen(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const roleCounts = {
        all: users.length,
        admin: users.filter(u => u.role === "admin").length,
        staff: users.filter(u => u.role === "staff").length,
        user: users.filter(u => u.role === "user").length,
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-coffee-brown tracking-tight">
                        Staff & User Management
                    </h1>
                    <p className="text-sm font-medium text-coffee-brown/40">
                        Manage roles, access control, and your team directory.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {["all", "admin", "staff", "user"].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                roleFilter === role
                                    ? "bg-coffee-brown text-white border-transparent shadow-lg"
                                    : "bg-white text-coffee-brown/50 border-coffee-brown/10 hover:border-coffee-brown/30"
                            }`}
                        >
                            {role === "all" ? "All" : role} ({roleCounts[role]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-brown/20" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-coffee-brown/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all font-medium text-coffee-brown shadow-sm text-sm"
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: roleCounts.all, color: "bg-coffee-brown text-white" },
                    { label: "Admins", value: roleCounts.admin, color: "bg-amber-50 text-amber-700 border border-amber-200" },
                    { label: "Staff", value: roleCounts.staff, color: "bg-blue-50 text-blue-700 border border-blue-200" },
                    { label: "Customers", value: roleCounts.user, color: "bg-cream text-coffee-brown/60 border border-coffee-brown/10" },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.color} rounded-2xl p-5 flex flex-col gap-1`}>
                        <span className="text-3xl font-black">{stat.value}</span>
                        <span className="text-xs font-bold tracking-widest uppercase opacity-70">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-coffee-brown/5 shadow-sm overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-coffee-brown/40 font-bold tracking-widest text-xs">Loading Directory...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-coffee-brown/5 border-b border-coffee-brown/5">
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-coffee-brown/40">User</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-coffee-brown/40">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-coffee-brown/40">Address</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-coffee-brown/40">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-coffee-brown/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-brown/5">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                                const isCurrentUser = user._id === currentUser?._id;
                                const badge = ROLE_STYLES[user.role] || ROLE_STYLES.user;
                                const BadgeIcon = badge.icon;
                                return (
                                    <tr key={user._id} className="hover:bg-coffee-brown/2 transition-colors group">
                                        {/* Identity */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-coffee-brown/5 flex items-center justify-center text-coffee-brown/40 group-hover:bg-accent-gold group-hover:text-white transition-all duration-300 font-bold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-coffee-brown leading-tight text-sm flex items-center gap-2">
                                                        {user.name}
                                                        {isCurrentUser && (
                                                            <span className="text-[8px] bg-accent-gold text-white px-2 py-0.5 rounded-full font-black tracking-widest uppercase">You</span>
                                                        )}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-bold text-coffee-brown/30 tracking-widest">
                                                        <Calendar size={9} />
                                                        Joined {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-coffee-brown/60">
                                                <Mail size={13} className="text-coffee-brown/20 shrink-0" />
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Address */}
                                        <td className="px-6 py-4">
                                            <div className="max-w-[180px]">
                                                {user.address && (user.address.street || user.address.city) ? (
                                                    <div className="flex items-start gap-2 text-[11px] font-semibold text-coffee-brown/60 leading-snug">
                                                        <MapPin size={11} className="text-accent-gold shrink-0 mt-0.5" />
                                                        <span>
                                                            {user.address.street}, {user.address.city}<br />
                                                            {user.address.state} {user.address.zipCode}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-coffee-brown/15 tracking-widest">Not provided</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Role Badge + Changer */}
                                        <td className="px-6 py-4">
                                            {isCurrentUser ? (
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${badge.classes}`}>
                                                    <BadgeIcon size={11} />
                                                    {badge.label}
                                                </div>
                                            ) : (
                                                <div className="relative inline-block">
                                                    <div className={`inline-flex items-center gap-1.5 pl-3 pr-8 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest cursor-pointer select-none ${badge.classes}`}>
                                                        {updatingRoleId === user._id ? (
                                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <BadgeIcon size={11} />
                                                        )}
                                                        {badge.label}
                                                        <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                    <select
                                                        value={user.role}
                                                        disabled={updatingRoleId === user._id}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="staff">Staff</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    disabled={user.role === "admin" || isCurrentUser}
                                                    title={isCurrentUser ? "Cannot delete yourself" : user.role === "admin" ? "Admins cannot be deleted" : "Delete User"}
                                                    className={`p-2.5 rounded-xl transition-all text-sm ${
                                                        user.role === "admin" || isCurrentUser
                                                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                                            : "bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"
                                                    }`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <UserCog size={36} className="text-coffee-brown/10 mx-auto mb-3" />
                                        <p className="text-coffee-brown/20 font-bold tracking-widest text-sm">No users found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={`user "${selectedUser?.name}"`}
            />
        </div>
    );
};

export default AdminUsers;
