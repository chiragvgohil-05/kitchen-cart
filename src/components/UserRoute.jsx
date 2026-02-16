import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
            </div>
        );
    }

    if (user && user.role === 'admin') {
        // Redirect admins to admin panel if they try to access user side
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default UserRoute;
