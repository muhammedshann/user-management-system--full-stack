import { Navigate } from "react-router-dom";

const UserRoute = ({children}) => {
    const token = localStorage.getItem('refreshToken');

    if (!token) return <Navigate to={'/login/'} replace />
    

    return children;
}
export default UserRoute;