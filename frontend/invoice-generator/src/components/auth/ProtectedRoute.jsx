import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../layout/DashboardLayout";

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <DashboardLayout>
            {children ? children : <Outlet />}
        </DashboardLayout>
    )
}

export default ProtectedRoute;
