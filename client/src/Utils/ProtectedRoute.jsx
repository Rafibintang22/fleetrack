import { useNavigate } from "@solidjs/router";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const navigate = useNavigate();
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const userRole = userSession?.dataUser?.Peran;

    const isAuthorized = allowedRoles.includes(userRole);

    if (!userSession || !isAuthorized) {
        navigate("/");
        return;
    }

    return <>{element}</>;
};

export default ProtectedRoute;
