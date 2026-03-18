import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
                <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Syncing Aura...</p>
            </div>
        );
    }

    // Allow browsing storefront for everyone. Redirect logic is usually better handled 
    // on the 'Login/Register' pages rather than blocking the whole storefront.
    
    return children;
};

export default UserRoute;
