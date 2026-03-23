import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
                <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Authenticating...</p>
            </div>

        );
    }

    // Logged in staff/admin should not access the customer storefront
    if (user) {
        if (user.role === 'staff') {
            return <Navigate to="/staff" replace />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }
    
    return children;
};


export default UserRoute;
