import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({
    children,
}: ProtectedRouteProps) => {

    const { user } = useAuth();

    if (!user) {
        window.location.href = "/login";

        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;