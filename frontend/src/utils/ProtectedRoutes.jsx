import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes(){
    const { isLogged } = useSelector((state) => state.auth);
    return isLogged ? <Outlet/> : <Navigate to="/login"/>;
}

export default ProtectedRoutes;